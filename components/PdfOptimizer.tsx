'use client'

import { useState, DragEvent, ChangeEvent } from 'react'
import { optimizePdf } from '@/app/actions/pdf'

export default function PdfOptimizer() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ original: number; optimized: number } | null>(null)

  // Manejadores de drag & drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    setResult(null)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
    } else {
      setError('Por favor, selecciona un archivo PDF válido')
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setResult(null)
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      setError('Por favor, selecciona un archivo PDF válido')
    }
  }

  // Optimizar PDF
  const handleOptimize = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      
      const optimizationResult = await optimizePdf(base64)

      if (optimizationResult.error) {
        setError(optimizationResult.error)
        return
      }

      // Mostrar estadísticas
      if (optimizationResult.size && optimizationResult.originalSize) {
        setResult({
          original: optimizationResult.originalSize,
          optimized: optimizationResult.size,
        })
      } else if (optimizationResult.size) {
        setResult({
          original: file.size,
          optimized: optimizationResult.size,
        })
      }

      // Solo descargar si hay datos
      if (optimizationResult.data) {
        // Descargar el PDF optimizado
        const blob = new Blob([Buffer.from(optimizationResult.data, 'base64')], { 
          type: 'application/pdf' 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace('.pdf', '_optimized.pdf')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError('Error al optimizar el PDF')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const calculateReduction = () => {
    if (!result) return 0
    return Math.round(((result.original - result.optimized) / result.original) * 100)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      {/* Zona de drag & drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
        }`}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="file-input-hidden"
          id="pdf-file-input"
        />
        
        <label htmlFor="pdf-file-input" className="cursor-pointer">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-green-600 dark:text-green-400">
              Click para seleccionar
            </span>{' '}
            o arrastra un PDF aquí
          </p>
        </label>
      </div>

      {/* Archivo seleccionado */}
      {file && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Archivo:</strong> {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tamaño original: {formatBytes(file.size)}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Resultados */}
      {result && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300 font-semibold mb-2">
            ✓ PDF optimizado exitosamente
          </p>
          <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
            <p>Original: {formatBytes(result.original)}</p>
            <p>Optimizado: {formatBytes(result.optimized)}</p>
            <p className="font-semibold">Reducción: {calculateReduction()}%</p>
          </div>
        </div>
      )}

      {/* Botón de optimización */}
      {file && (
        <div className="mt-6">
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Optimizando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Optimizar y Descargar
              </>
            )}
          </button>
        </div>
      )}

      {/* Nota sobre la optimización */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Método de optimización:</strong> Se extrae el contenido del PDF y se regenera con compresión agresiva usando Chromium.
          Los resultados varían según el tipo de PDF. PDFs ya optimizados mostrarán poca o ninguna reducción.
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          ⚠️ <strong>Nota:</strong> Se pierde formato complejo e imágenes. Ideal para PDFs de texto sin optimizar.
        </p>
      </div>
    </div>
  )
}
