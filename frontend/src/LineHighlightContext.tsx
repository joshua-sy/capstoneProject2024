import React, { createContext, useContext, useState } from 'react';

interface LineHighlightContextProps {
  lineNumToHighlight: number[];
  setLineNumToHighlight: (newLineNumToHighlight: number[]) => void;
}

const LineHighlightContext = createContext<any>(null);

export const LineHighlightProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lineNumToHighlight, setLineNumToHighlight] = useState<number[]>([]);
  console.log('lineNumToHiglight in LineHighlightContext', lineNumToHighlight);

  return (
    <LineHighlightContext.Provider value={{ lineNumToHighlight, setLineNumToHighlight }}>
      {children}
    </LineHighlightContext.Provider>
  );
};

export const useLineHighlight = () => {
  const context = useContext(LineHighlightContext);
  if (!context) {
    throw new Error('useLineHighlight must be used within a LineHighlightProvider');
  }
  return context;
};