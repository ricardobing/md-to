'use server'

import MarkdownIt from 'markdown-it'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { convert as htmlToText } from 'html-to-text'

/**
 * Convierte Markdown a PDF
 * Limitaciones: Diseño simple, sin imágenes complejas
 * Vercel limits: 10MB request body, 10s timeout
 */
export async function convertMarkdownToPdf(markdown: string) {
  try {
    // Validación de tamaño
    if (markdown.length > 5 * 1024 * 1024) { // 5MB de texto
      return { error: 'El archivo es demasiado grande (máximo 5MB de texto)' }
    }

    // Parsear markdown a HTML
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
    const html = md.render(markdown)

    // Convertir HTML a texto plano con formato
    const text = htmlToText(html, {
      wordwrap: 80,
      selectors: [
        { selector: 'h1', options: { uppercase: false } },
        { selector: 'h2', options: { uppercase: false } },
        { selector: 'a', options: { ignoreHref: false } },
      ],
    })

    // Crear PDF
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Configuración de página
    const pageWidth = 595 // A4 width in points
    const pageHeight = 842 // A4 height in points
    const margin = 50
    const fontSize = 11
    const lineHeight = fontSize * 1.5
    const maxWidth = pageWidth - 2 * margin

    let page = pdfDoc.addPage([pageWidth, pageHeight])
    let y = pageHeight - margin

    // Dividir el texto en líneas
    const lines = text.split('\n')

    for (const line of lines) {
      // Verificar si necesitamos una nueva página
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = pageHeight - margin
      }

      // Detectar encabezados (líneas que comienzan con caracteres especiales)
      const isHeading = /^[=#\*]{1,3}\s/.test(line) || line.toUpperCase() === line && line.length < 60

      const currentFont = isHeading ? boldFont : font
      const currentSize = isHeading ? fontSize + 2 : fontSize

      // Manejar líneas largas (word wrap simple)
      if (line.trim()) {
        const words = line.split(' ')
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const width = currentFont.widthOfTextAtSize(testLine, currentSize)

          if (width > maxWidth && currentLine) {
            // Dibujar línea actual
            page.drawText(currentLine, {
              x: margin,
              y,
              size: currentSize,
              font: currentFont,
              color: rgb(0, 0, 0),
            })
            y -= lineHeight
            currentLine = word

            // Verificar nueva página
            if (y < margin + lineHeight) {
              page = pdfDoc.addPage([pageWidth, pageHeight])
              y = pageHeight - margin
            }
          } else {
            currentLine = testLine
          }
        }

        // Dibujar última línea
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y,
            size: currentSize,
            font: currentFont,
            color: rgb(0, 0, 0),
          })
        }
      }

      y -= lineHeight
    }

    // Agregar metadata
    pdfDoc.setTitle('Documento convertido desde Markdown')
    pdfDoc.setCreator('MD-to Converter')
    pdfDoc.setProducer('md-to-converter')

    // Serializar PDF
    const pdfBytes = await pdfDoc.save()
    const base64 = Buffer.from(pdfBytes).toString('base64')

    return { data: base64, error: null }
  } catch (error) {
    console.error('Error converting markdown to PDF:', error)
    return { error: 'Error al convertir el markdown a PDF' }
  }
}

/**
 * Convierte Markdown a DOCX
 * Soporta encabezados, listas, y texto formateado básico
 */
export async function convertMarkdownToDocx(markdown: string) {
  try {
    // Validación de tamaño
    if (markdown.length > 5 * 1024 * 1024) {
      return { error: 'El archivo es demasiado grande (máximo 5MB de texto)' }
    }

    // Parsear markdown a HTML
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
    const html = md.render(markdown)

    // Convertir HTML a estructura de párrafos
    // Esta es una conversión simple; para mejor resultado, usar librería especializada
    const lines = markdown.split('\n')
    const paragraphs: Paragraph[] = []

    for (const line of lines) {
      if (!line.trim()) {
        // Línea vacía
        paragraphs.push(new Paragraph({ text: '' }))
        continue
      }

      // Detectar encabezados
      if (line.startsWith('# ')) {
        paragraphs.push(
          new Paragraph({
            text: line.substring(2),
            heading: HeadingLevel.HEADING_1,
          })
        )
      } else if (line.startsWith('## ')) {
        paragraphs.push(
          new Paragraph({
            text: line.substring(3),
            heading: HeadingLevel.HEADING_2,
          })
        )
      } else if (line.startsWith('### ')) {
        paragraphs.push(
          new Paragraph({
            text: line.substring(4),
            heading: HeadingLevel.HEADING_3,
          })
        )
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        // Lista
        paragraphs.push(
          new Paragraph({
            text: line.substring(2),
            bullet: {
              level: 0,
            },
          })
        )
      } else if (/^\d+\.\s/.test(line)) {
        // Lista numerada
        paragraphs.push(
          new Paragraph({
            text: line.replace(/^\d+\.\s/, ''),
            numbering: {
              reference: 'default-numbering',
              level: 0,
            },
          })
        )
      } else {
        // Texto normal con formato básico
        const hasStrongOrItalic = /\*\*|\*|__|_/.test(line)
        
        if (hasStrongOrItalic) {
          // Parseo simple de negritas e itálicas
          const textRuns: TextRun[] = []
          const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_)/)
          
          for (const part of parts) {
            if (part.startsWith('**') && part.endsWith('**')) {
              textRuns.push(new TextRun({ text: part.slice(2, -2), bold: true }))
            } else if (part.startsWith('*') && part.endsWith('*')) {
              textRuns.push(new TextRun({ text: part.slice(1, -1), italics: true }))
            } else if (part.startsWith('__') && part.endsWith('__')) {
              textRuns.push(new TextRun({ text: part.slice(2, -2), bold: true }))
            } else if (part.startsWith('_') && part.endsWith('_')) {
              textRuns.push(new TextRun({ text: part.slice(1, -1), italics: true }))
            } else if (part) {
              textRuns.push(new TextRun({ text: part }))
            }
          }
          
          paragraphs.push(new Paragraph({ children: textRuns }))
        } else {
          paragraphs.push(new Paragraph({ text: line }))
        }
      }
    }

    // Crear documento DOCX
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    })

    // Generar buffer
    const buffer = await Packer.toBuffer(doc)
    const base64 = Buffer.from(buffer).toString('base64')

    return { data: base64, error: null }
  } catch (error) {
    console.error('Error converting markdown to DOCX:', error)
    return { error: 'Error al convertir el markdown a DOCX' }
  }
}
