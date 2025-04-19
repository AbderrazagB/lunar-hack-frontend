import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import VoiceVisualizer from './VoiceVisualizer';
import axios from 'axios';

const AudioModal = ({ 
  show, 
  onHide, 
  onAudioComplete,
  title = "Speech Chat",
  messages,
  setMessages
}) => {
  const [recording, setRecording] = useState(false);
  const [talking, setTalking] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => stopRecording();
  }, []);

  const startRecording = async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });

        if (audioBlob.size > 0) {
          await handleAudioComplete(audioBlob);
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        setRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please allow permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleAudioComplete = async (audioBlob) => {
    if (!audioBlob || audioBlob.size === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      const audioFile = new File([audioBlob], 'recording.webm', {
        type: audioBlob.type,
        lastModified: Date.now()
      });

      formData.append('file', audioFile);

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
      
      setMessages([...messages, userMessage]);

      if (onAudioComplete) {
        await onAudioComplete(response.data);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error uploading audio. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    stopRecording();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <VoiceVisualizer isRecording={recording} isBotTalking={talking}/>
        <div className="mt-4">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Button
              variant={recording ? "danger" : "primary"}
              size="lg"
              onClick={recording ? stopRecording : startRecording}
              className="px-4"
            >
              {recording ? (
                <>
                  <FaStop className="me-2" /> Stop
                </>
              ) : (
                <>
                  Start Talking
                </>
              )}
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AudioModal;
