import React, { useState, useRef, useEffect } from 'react';
import { doOpenAICall } from '../../services/openAIService';
import styles from './codeGPT.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import RefreshIcon from '@mui/icons-material/Refresh';

const CodeGPT = ({ code, graphs = {}, terminalOutput, llvmIR, savedMessages, onSaveMessages, passedPrompt }: { code: string, graphs: any, terminalOutput: string, llvmIR: string, savedMessages: any, onSaveMessages: any, passedPrompt: string }) => {
  const [messages, setMessages] = useState(savedMessages || []);
  const [gptInputQuery, setGptInputQuery] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState('code');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async () => {
    callChatGPT(gptInputQuery);
  };

  const callChatGPT = async (prompt: string) => {
    if (!prompt.trim()) return;

    const newMessage = { role: 'user', content: prompt };
    const updatedMessages = [...messages, newMessage, { role: 'assistant', content: "Loading response..." }];
    setMessages(updatedMessages);
    onSaveMessages(updatedMessages);
    setGptInputQuery('');

    try {
      const response = await doOpenAICall([{ role: 'user', content: prompt }]);
      const assistantMessage = { role: 'assistant', content: response.choices[0].message.content };
      const finalMessages = [...updatedMessages.slice(0, -1), assistantMessage];
      setMessages(finalMessages);
      onSaveMessages(finalMessages);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: "Error: " + error.message };
      const errorMessages = [...updatedMessages.slice(0, -1), errorMessage];
      setMessages(errorMessages);
      onSaveMessages(errorMessages);
    }
  }

  useEffect(() => {
    if (passedPrompt !== '') {
      callChatGPT(passedPrompt);
    }
  }, [passedPrompt]);

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

  const wrapInBackticks = (content: string) => {
    return `\`\`\`\n${content}\n\`\`\``;
  };

  const handleSuggestionClick = (suggestion: string, suggestionGroup: string) => {
    // if (suggestion.includes('code') && suggestionGroup !== 'code') {
    //   suggestion = `Explain the following code:\n\n${wrapInBackticks(code)}`;
    // } else if (suggestion.includes('graph')) {
    //   Object.keys(graphs).forEach(graph => {
    //     suggestion = suggestion.replace(`Explain the following graph (${graph}):\n\n${graphs[graph]}`, `Explain the following graph (${graph}):\n\n${wrapInBackticks(graphs[graph])}`);
    //   });
    // } else if (suggestion.includes('terminal')) {
    //   suggestion = `Explain the following terminal output:\n\n${wrapInBackticks(terminalOutput)}`;
    // } else if (suggestion.includes('LLVM IR')) {
    //   suggestion = `Explain the following LLVM IR:\n\n${wrapInBackticks(llvmIR)}`;
    // }
    setGptInputQuery(suggestion);
  };

  const handleReset = () => {
    setMessages([]);
    onSaveMessages([]);
  };


const renderMessageContent = (content: string, role: string) => {
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const parts = content.split(codeBlockRegex);

  return (
    <div className={styles[role === 'user' ? 'userMessage' : 'assistantMessage']}>
      {parts.map((part, index) => {
        if (index % 2 === 1) { // Code block
          return (
            <SyntaxHighlighter key={index} language="c" style={syntaxStyle} className={styles.syntaxHighlighter}>
              {part.trim()}
            </SyntaxHighlighter>
          );
        }
        return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>; // Regular text with role-based styling
      })}
    </div>
  );
};

  const renderSuggestions = () => {
    switch (suggestionCategory) {
      case 'code':
        return (
          <>
            {code && (<button
              onClick={() => handleSuggestionClick(`Explain the following code:\n\n${wrapInBackticks(code)}`, 'code')}
              className={styles.suggestionButton}
            >
              Explain the code
            </button>)}
            {code && (<button
              onClick={() => handleSuggestionClick(`What are some improvements that can be made to the following code:\n\n${wrapInBackticks(code)}`, 'code')}
              className={styles.suggestionButton}
            >
              Suggest improvements
            </button>)}
            {code && (<button
              onClick={() => handleSuggestionClick(`Are there any bugs in the following code:\n\n${wrapInBackticks(code)}`, 'code')}
              className={styles.suggestionButton}
            >
              Find bugs
            </button>)}
          </>
        );
      case 'graphs':
        return (
          <>
            {Object.keys(graphs).map(graph => (
              <button
                key={graph}
                onClick={() => handleSuggestionClick(`Explain the following graph (${graph}):\n\n${wrapInBackticks(graphs[graph])}`, 'graph')}
                className={styles.suggestionButton}
              >
                Explain {graph}
              </button>
            ))}
            {code && (<button
              onClick={() => handleSuggestionClick(`Looking at the graphs, can I make any improvements to the code?\n\n${wrapInBackticks(code)}`, 'graph')}
              className={styles.suggestionButton}
            >
              Improvements from graphs
            </button>)}
            {code && (<button
              onClick={() => handleSuggestionClick(`Are there any dead functions in my code?\n\n${wrapInBackticks(code)}`, 'graph')}
              className={styles.suggestionButton}
            >
              Find dead functions
            </button>)}
          </>
        );
      case 'terminal':
        return (
          <>
            {terminalOutput !== 'Run the code to see the terminal output here' && (<button
              onClick={() => handleSuggestionClick(`Explain the following terminal output:\n\n${wrapInBackticks(terminalOutput)}`, 'terminal')}
              className={styles.suggestionButton}
            >
              Explain terminal output
            </button>)}
          </>
        );
      case 'llvm':
        return (
          <>
            {llvmIR !== 'Run the code to see the LLVM IR of your here' && (<button
              onClick={() => handleSuggestionClick(`Explain the following LLVM IR:\n\n${wrapInBackticks(llvmIR)}`, 'llvm')}
              className={styles.suggestionButton}
            >
              Explain LLVM IR
            </button>)}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.codegptContainer}>
      <div className={styles.stickyHeader}>
        <button onClick={handleReset} className={styles.resetButton}>
          <RefreshIcon />
        </button>
      </div>
      <div className={styles.codegptResponse}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.role]}`}>
            {message.role === 'assistant' && <div className={styles.assistantLabel}>CodeGPT</div>}
            {renderMessageContent(message.content, message.role)}
          </div>
        ))}
      </div>
      <div className={styles.stickyContainer}>
        <div className={styles.suggestionCategory}>
          <button
            onClick={() => setSuggestionCategory('code')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'code' ? styles.active : ''}`}
          >
            Code
          </button>
          <button
            onClick={() => setSuggestionCategory('graphs')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'graphs' ? styles.active : ''}`}
          >
            Graphs
          </button>
          <button
            onClick={() => setSuggestionCategory('terminal')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'terminal' ? styles.active : ''}`}
          >
            Terminal Output
          </button>
          <button
            onClick={() => setSuggestionCategory('llvm')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'llvm' ? styles.active : ''}`}
          >
            LLVM IR
          </button>
        </div>
        <div className={styles.suggestions}>
          {renderSuggestions()}
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
    </div>
  );
};

export default CodeGPT;
