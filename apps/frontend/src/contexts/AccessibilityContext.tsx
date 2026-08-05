import React, { createContext, useContext, useState } from 'react';

interface AccessibilityContextType {
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  screenReaderMode: boolean;
  toggleScreenReaderMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [screenReaderMode, setScreenReaderMode] = useState<boolean>(false);

  const toggleScreenReaderMode = () => setScreenReaderMode((prev) => !prev);

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, screenReaderMode, toggleScreenReaderMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}
