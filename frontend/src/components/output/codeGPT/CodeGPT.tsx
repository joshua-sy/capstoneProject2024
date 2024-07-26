import React, { useState, useRef, useEffect } from 'react';
import { doOpenAICall } from '../../services/openAIService';
import './codeGPT.module.css';

const CodeGPT = () => {
  const [gptInputQuery, setGptInputQuery] = useState('');
  const [apiResponseContent, setApiResponseContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    setApiResponseContent("Loading response...");
    try {
      const response = await doOpenAICall([{ role: 'user', content: gptInputQuery }]);
      setApiResponseContent("GPT Response: " + response.choices[0].message.content);
    } catch (error) {
      setApiResponseContent("Error: " + error.message);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [gptInputQuery]);

  return (
    <div className="codegpt-container">
      <div className="codegpt-response">
        {apiResponseContent}
      </div>
      <div className="codegpt-input-container">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Enter your query here..."
          value={gptInputQuery}
          onChange={(e) => setGptInputQuery(e.target.value)}
          className="codegpt-textarea"
          style={{ resize: 'none' }}
        />
        <button onClick={handleSubmit} className="codegpt-button">
          ↑
        </button>
      </div>
    </div>
  );
};

export default CodeGPT;
