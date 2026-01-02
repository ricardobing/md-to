# Guía de Deployment en Vercel

## Pasos para Desplegar

### 1. Preparación
El código ya está en GitHub: https://github.com/ricardobing/md-to

### 2. Deploy en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Click en "Add New..." → "Project"
3. Importa el repositorio `ricardobing/md-to`
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Click en "Deploy"

### 3. Configuración (Opcional)

No se requiere configuración adicional. El proyecto está optimizado para deployment con:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Variables de Entorno

Este proyecto NO requiere variables de entorno.

### 5. Límites a Considerar

#### Vercel Hobby (Free) Plan:
- **Function Size**: 50MB
- **Function Memory**: 1024MB
- **Function Duration**: 10 segundos
- **Request Body**: 4.5MB (ajustado a 10MB en config)
- **Bandwidth**: 100GB/mes

#### Recomendaciones:
- Archivos Markdown: hasta 5MB de texto
- PDFs para optimizar: hasta 10MB
- Para archivos más grandes, considera Vercel Pro

### 6. Monitoreo Post-Deploy

Después del deployment:
- Vercel asignará un URL (ej: `md-to.vercel.app`)
- Prueba la conversión de Markdown
- Prueba la optimización de PDF
- Verifica los logs en el dashboard de Vercel

### 7. Custom Domain (Opcional)

Para agregar un dominio personalizado:
1. Ve a Project Settings → Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones

### 8. Actualizar el Proyecto

Para futuras actualizaciones:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel hará el re-deploy automáticamente.

## Troubleshooting

### Error: Function timeout
- Reducir el tamaño de archivo
- Considerar actualizar a Vercel Pro (timeout de 60s)

### Error: Request body too large
- El límite está en 10MB (configurado en next.config.js)
- Para archivos más grandes, necesitas Vercel Pro

### Error: Memory exceeded
- Archivos muy complejos pueden exceder los 1024MB
- Considera procesamiento en chunks o Vercel Pro (3GB)

## Monitoreo y Analytics

Activa en Vercel Dashboard:
- **Analytics**: Para ver tráfico y performance
- **Speed Insights**: Para métricas de velocidad
- **Logs**: Para debugging

## Seguridad

El proyecto ya incluye:
- Validación de tipos de archivo
- Límites de tamaño
- Procesamiento en memoria (no se guardan archivos)
- Sin base de datos (sin riesgo de SQL injection)

---

¿Preguntas? Abre un issue en: https://github.com/ricardobing/md-to/issues
