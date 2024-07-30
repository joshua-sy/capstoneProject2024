import React, { useState, useRef, useEffect } from 'react';
import { doOpenAICall } from '../../services/openAIService';
import styles from './codeGPT.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeGPT = ({ code }: { code: string }) => {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [gptInputQuery, setGptInputQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async () => {
    if (!gptInputQuery.trim()) return;

    const newMessage = { role: 'user', content: gptInputQuery };
    setMessages(prev => [...prev, newMessage]);
    setGptInputQuery('');
    setMessages(prev => [...prev, { role: 'assistant', content: "Loading response..." }]);

    try {
      const response = await doOpenAICall([{ role: 'user', content: gptInputQuery }]);
      const assistantMessage = { role: 'assistant', content: response.choices[0].message.content };
      setMessages(prev => [...prev.slice(0, -1), assistantMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: "Error: " + error.message };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [gptInputQuery]);

  const handleSuggestionClick = (suggestion: string) => {
    setGptInputQuery(suggestion);
  };

  const renderMessageContent = (content: string) => {
    if (content.startsWith('```') && content.endsWith('```')) {
      const codeContent = content.slice(3, -3).trim();
      return (
        <SyntaxHighlighter language="c" style={syntaxStyle} className={styles.syntaxHighlighter}>
          {codeContent}
        </SyntaxHighlighter>
      );
    }
    return content;
  };

  return (
    <div className={styles.codegptContainer}>
      <div className={styles.codegptResponse}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.role]}`}>
            {message.role === 'assistant' && <div className={styles.assistantLabel}>Assistant</div>}
            {renderMessageContent(message.content)}
          </div>
        ))}
      </div>
      <div className={styles.suggestions}>
        <button
          onClick={() => handleSuggestionClick(`Explain the following code:\n\n${code}`)}
          className={styles.suggestionButton}
        >
          Explain the code
        </button>
        {/* Add more suggestions here as needed */}
      </div>
      <div className={styles.codegptInputContainer}>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Enter your query here..."
          value={gptInputQuery}
          onChange={(e) => setGptInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.codegptTextarea}
        />
        <button
          onClick={handleSubmit}
          className={styles.codegptButton}
          ref={buttonRef}
          title="Submit"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default CodeGPT;
