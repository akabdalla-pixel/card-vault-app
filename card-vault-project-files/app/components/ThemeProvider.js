'use client'
import { useEffect } from 'react'

export const THEMES = [
  { name: 'Purple', accent: '#9333ea', accentLight: '#a855f7', rgb: '147,51,234' },
  { name: 'Blue',   accent: '#2563eb', accentLight: '#3b82f6', rgb: '37,99,235'  },
  { name: 'Cyan',   accent: '#0891b2', accentLight: '#06b6d4', rgb: '8,145,178'  },
  { name: 'Green',  accent: '#16a34a', accentLight: '#22c55e', rgb: '22,163,74'  },
  { name: 'Orange', accent: '#ea580c', accentLight: '#f97316', rgb: '234,88,12'  },
  { name: 'Pink',   accent: '#db2777', accentLight: '#ec4899', rgb: '219,39,119' },
  { name: 'Gold',   accent: '#d97706', accentLight: '#f59e0b', rgb: '217,119,6'  },
  { name: 'Teal',   accent: '#0d9488', accentLight: '#14b8a6', rgb: '13,148,136' },
]

export function applyTheme(theme) {
  const root = document.documentElement
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent-light', theme.accentLight)
  root.style.setProperty('--accent-rgb', theme.rgb)
  // also update the PWA theme-color meta tag
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme.accent)
}

export function getSavedTheme() {
  try {
    const name = localStorage.getItem('topload-theme')
    return THEMES.find(t => t.name === name) || THEMES[0]
  } catch { return THEMES[0] }
}

export default function ThemeProvider({ children }) {
  useEffect(() => {
    applyTheme(getSavedTheme())
  }, [])
  return children
}
