import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage';
import ChatbotPage from './components/chatbot/ChatbotPage';
import LostAndFoundPage from './components/lost-and-found/LostAndFoundPage';
import AudioModal from './components/voice-modal/AudioModal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/lost-and-found" element={<LostAndFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
