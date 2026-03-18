'use client'
import { useEffect } from 'react'

export const THEMES = [
  { name: 'Purple', accent: '#9333ea', accentLight: '#a855f7', rgb: '147,51,234', bg: '#0E0C1A' },
  { name: 'Blue',   accent: '#2563eb', accentLight: '#3b82f6', rgb: '37,99,235',  bg: '#0C0E1A' },
  { name: 'Cyan',   accent: '#0891b2', accentLight: '#06b6d4', rgb: '8,145,178',  bg: '#0A1214' },
  { name: 'Green',  accent: '#16a34a', accentLight: '#22c55e', rgb: '22,163,74',  bg: '#0A140C' },
  { name: 'Orange', accent: '#ea580c', accentLight: '#f97316', rgb: '234,88,12',  bg: '#160E08' },
  { name: 'Pink',   accent: '#db2777', accentLight: '#ec4899', rgb: '219,39,119', bg: '#15080E' },
  { name: 'Gold',   accent: '#d97706', accentLight: '#f59e0b', rgb: '217,119,6',  bg: '#151108' },
  { name: 'Teal',   accent: '#0d9488', accentLight: '#14b8a6', rgb: '13,148,136', bg: '#0A1413' },
]

export function applyTheme(theme) {
  const root = document.documentElement
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent-light', theme.accentLight)
  root.style.setProperty('--accent-rgb', theme.rgb)
  root.style.setProperty('--surface-tint', theme.bg)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme.accent)
}

export function getSavedTheme() {
  try {
    const name = localStorage.getItem('topload-theme')
    return THEMES.find(t => t.name === name) || THEMES[0]
  } catch { return THEMES[0] }
}

export function initPrivacy() {
  try {
    if (localStorage.getItem('topload-privacy') === '1')
      document.body.classList.add('privacy-mode')
  } catch {}
}

export function togglePrivacy() {
  const on = document.body.classList.toggle('privacy-mode')
  try { localStorage.setItem('topload-privacy', on ? '1' : '0') } catch {}
  return on
}

export function isPrivacyOn() {
  try { return localStorage.getItem('topload-privacy') === '1' } catch { return false }
}

export async function saveThemeToServer(themeName) {
  try {
    await fetch('/api/user/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: themeName }),
    })
  } catch { /* non-critical */ }
}

export default function ThemeProvider({ children }) {
  useEffect(() => {
    // 1. Apply localStorage immediately — no flash, always takes priority
    applyTheme(getSavedTheme())
    initPrivacy()

    // 2. Only check server if localStorage has no saved choice (new device / cleared browser)
    //    This prevents the server default ("Purple") from overwriting a real local preference
    try {
      if (localStorage.getItem('topload-theme')) return
    } catch {}

    fetch('/api/user/theme')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.theme) return
        const serverTheme = THEMES.find(t => t.name === data.theme)
        if (!serverTheme) return
        localStorage.setItem('topload-theme', data.theme)
        applyTheme(serverTheme)
      })
      .catch(() => {})
  }, [])

  return children
}
