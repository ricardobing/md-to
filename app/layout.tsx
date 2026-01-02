import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MD-to Converter | Markdown to PDF/DOCX',
  description: 'Convierte archivos Markdown a PDF o DOCX y optimiza PDFs fácilmente',
  authors: [{ name: 'Ricardo Bing', url: 'https://glowecom.vercel.app/' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
