import React, { useState, useRef, useEffect } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { FaRobot, FaPaperPlane, FaUser } from 'react-icons/fa';
import UniversalNavbar from '../navbar/UniversalNavbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AudioModal from '../voice-modal/AudioModal';
import '../../styles/chatbot.scss';
import axios from 'axios';

const ChatbotPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const streamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour! Je suis votre assistant universitaire. Comment puis-je vous aider aujourd'hui?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Je suis désolé, je suis en train d'apprendre. Je ne peux pas répondre à cette question pour le moment.",
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleAudioComplete = async (audioData) => {
    try {
      console.log('Received audio data:', audioData);
      
      if (audioData instanceof Blob) {
        // For testing: play the recorded audio
        const url = URL.createObjectURL(audioData);
        const audio = new Audio(url);
        await audio.play();
      } else {
        // Handle response from server
        console.log('Server response:', audioData);
      }
    } catch (error) {
      console.error('Error handling audio:', error);
    }
  };

  const handleMicClick = async () => {
    if (recording) {
      console.log("Stopping recording...");
      
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
  
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
  
      setRecording(false);
      return;
    }
  
    try {
      console.log("Starting recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
  
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
  
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
  
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
  
      mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
  
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
  
        if (!audioBlob || audioBlob.size === 0) return;
  
        const audioFile = new File([audioBlob], 'recording.webm', {
          type: audioBlob.type,
          lastModified: Date.now()
        });
  
        const formData = new FormData();
        formData.append('file', audioFile);
  
        try {
          const response = await axios.post(
            'http://0.0.0.0:8001/transcribe',
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              maxContentLength: Infinity,
              maxBodyLength: Infinity
            }
          );
  
          const userMessage = {
            id: messages.length + 1,
            text: response.data.transcript,
            sender: 'user'
          };
  
          setMessages(prevMessages => [...prevMessages, userMessage]);
  
          // Optional: call a bot response
          setTimeout(() => {
            const botMessage = {
              id: messages.length + 2,
              text: "Je suis désolé, je suis en train d'apprendre. Je ne peux pas répondre à cette question pour le moment.",
              sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
          }, 1000);
          
        } catch (error) {
          console.error('Upload failed:', error);
          alert('Error uploading audio. Try again.');
        }
  
        audioChunksRef.current = [];
      };
  
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Mic access error:', error);
      alert('Microphone access is required to record audio.');
    }
  };
  
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
  
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  
  
  return (
    <div className="chatbot-page">
      <UniversalNavbar />
      
      <Container fluid className="chatbot-container">
        <div className="chatbot-main">
        <AudioModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onAudioComplete={handleAudioComplete}
        title="Record Your Voice"
        messages = {messages}
        setMessages = {setMessages}
      />
          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'bot' ? <FaRobot /> : <FaUser />}
              </div>
              <div className="message-content">
                {message.text}
              </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-container">
            
            <Form onSubmit={handleSendMessage} className="chat-input-form">
            <Form.Group className="d-flex position-relative">
  <Button variant="primary" className='voice-button' onClick={() => setShowModal(true)}>
    <i className="bi bi-soundwave"></i>
  </Button>

  <button
    type="button"
    className={`mic-icon ${recording ? 'recording' : ''}`}
    onClick={handleMicClick}
    title={recording ? 'Recording... Click to stop' : 'Click to record'}
  >
    <i className="bi bi-mic-fill"></i>
  </button>

  <Form.Control
    type="text"
    placeholder="Tapez votre message ici..."
    value={inputMessage}
    onChange={(e) => setInputMessage(e.target.value)}
    className="chat-input ps-5" // extra padding left to avoid overlap with mic
  />

  <Button type="submit" variant="primary" className="send-button">
    <FaPaperPlane />
  </Button>
</Form.Group>

              <div className="input-footer">
                L'assistant peut produire des informations inexactes. Consultez toujours les sources officielles.
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChatbotPage; 