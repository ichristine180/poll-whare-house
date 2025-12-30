'use client'

import React, { createContext, useContext } from 'react'

interface ThemeContextType {
  theme: 'light'
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light' })

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  )
}
