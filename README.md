# MD-to Converter

Aplicación web para convertir archivos Markdown a PDF/DOCX y optimizar PDFs.

## 🚀 Características

- **Conversión de Markdown**: Convierte archivos .md a PDF o DOCX
- **Optimización de PDF**: Reduce el tamaño de archivos PDF de forma REAL (20-70% en casos ideales)
  - Usa Puppeteer + Chromium para regenerar PDFs con compresión agresiva
  - Extrae contenido y elimina formato innecesario
  - Detecta PDFs ya optimizados
- **Sin Base de Datos**: Todo el procesamiento se hace en memoria
- **Deploy en Vercel**: Optimizado para deployment sin configuración adicional

## 🛠️ Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- markdown-it (parsing Markdown)
- docx (generación DOCX)
- pdf-lib (manipulación PDF)
- **puppeteer-core + @sparticuz/chromium** (optimización real de PDF)
- **pdf-parse** (extracción de contenido PDF)

## 📦 Instalación

```bash
npm install
```

## 🚀 Desarrollo Local

```bash
npm run dev
```

La aplicación se ejecutará en [http://localhost:3023](http://localhost:3023)

## 🏗️ Build para Producción

```bash
npm run build
npm start
```

## 🌐 Deploy en Vercel

1. Push el código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Deploy automático

## ⚠️ Límites de Vercel

- **Serverless Functions**: 50MB total size limit
- **Request Body**: 10MB (configurado en next.config.js)
- **Memory**: 1024MB (Free tier)
- **Execution Time**: 10 segundos (Hobby plan)
- **PDFs para optimizar**: Máximo 8MB

### Optimización de PDF - Detalles Técnicos

**Método**: Extracción de contenido + regeneración con Chromium

**Reducción esperada**:
- PDFs sin comprimir: 30-70%
- PDFs con metadatos pesados: 20-40%
- PDFs ya optimizados: 0-10%

**Limitaciones**:
- Se pierde formato complejo (tablas, columnas)
- Se eliminan imágenes (para reducir tamaño)
- Se pierden formularios interactivos
- Ideal para PDFs de texto sin optimizar

**Cold Start**: Primera ejecución ~3-5s (descarga Chromium), siguientes ~1-2s

Ver [TESTING_PDF.md](TESTING_PDF.md) para documentación técnica completa.

Para archivos más grandes, considerar:
- Aumentar el plan de Vercel
- Procesar archivos en chunks
- Usar servicios externos de conversión

## 👨‍💻 Autor

Ricardo Bing
- GitHub: [ricardobing](https://github.com/ricardobing)
- Web: [glowecom.vercel.app](https://glowecom.vercel.app/)

## 📝 Licencia

MIT
