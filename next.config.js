/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Vercel
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Límite de 10MB para archivos
    },
  },
  // Optimizaciones
  swcMinify: true,
}

module.exports = nextConfig
