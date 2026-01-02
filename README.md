# MD-to Converter

Aplicación web para convertir archivos Markdown a PDF/DOCX y optimizar PDFs.

## 🚀 Características

- **Conversión de Markdown**: Convierte archivos .md a PDF o DOCX
- **Optimización de PDF**: Reduce el tamaño de archivos PDF
- **Sin Base de Datos**: Todo el procesamiento se hace en memoria
- **Deploy en Vercel**: Optimizado para deployment sin configuración adicional

## 🛠️ Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- markdown-it
- docx
- pdf-lib

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
