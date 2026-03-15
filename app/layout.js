import './globals.css'

export const metadata = {
  title: 'TopLoad',
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
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0c0f1a] text-[#f0f2ff] antialiased">
        {children}
      </body>
    </html>
  )
}
