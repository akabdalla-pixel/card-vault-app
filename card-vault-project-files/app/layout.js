import './globals.css'

export const metadata = {
  title: 'CardVault',
  description: 'Sports Card Investment Tracker',
  manifest: '/manifest.json',
  themeColor: '#111118',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CardVault',
  },
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
      <body className="bg-[#111118] text-[#eeeef5] antialiased">
        {children}
      </body>
    </html>
  )
}
