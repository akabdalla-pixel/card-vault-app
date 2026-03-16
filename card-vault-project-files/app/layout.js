import './globals.css'

export const metadata = {
  title: '𝙏𝙤𝙥𝙇𝙤𝙖𝙙',
  description: 'Sports Card Investment Tracker',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
