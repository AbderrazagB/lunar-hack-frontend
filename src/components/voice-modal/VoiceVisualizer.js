import React, { useEffect, useState } from 'react';
import '../../styles/VoiceVisualizer.scss';

const VoiceVisualizer = ({ isRecording, isBotTalking }) => {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (isRecording || isBotTalking) {
      setSpeaking(true);
    } else {
      setSpeaking(false);
    }
  }, [isRecording, isBotTalking]);

  return (
    <div className="voice-visualizer-container">
      <div className={`mic-circle ${speaking ? 'speaking' : ''} ${isBotTalking ? 'bot-talking' : ''}`}>
        <div className="inner-circle" />
        <div className="outer-rings" />
      </div>
    </div>
  );
};

export default VoiceVisualizer;
