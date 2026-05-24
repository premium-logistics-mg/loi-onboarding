"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { X, Camera, RotateCcw, Check, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (photoData: string) => void
  onCancel: () => void
  title: string
  instructions?: string
}

export function CameraCapture({ onCapture, onCancel, title, instructions }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
    } catch (err) {
      console.error("Camera error:", err)
      setError("Camera non disponible. Utilisez la galerie.")
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [facingMode])

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    
    // Compress image
    const photoData = canvas.toDataURL("image/jpeg", 0.7)
    setCapturedImage(photoData)
    stopCamera()
  }, [stopCamera])

  const handleRetake = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }, [capturedImage, onCapture])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setCapturedImage(result)
      stopCamera()
    }
    reader.readAsDataURL(file)
  }, [stopCamera])

  const handleCancel = useCallback(() => {
    stopCamera()
    onCancel()
  }, [stopCamera, onCancel])

  const toggleFacingMode = useCallback(() => {
    stopCamera()
    setFacingMode(prev => prev === "environment" ? "user" : "environment")
  }, [stopCamera])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/95">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {instructions && (
            <p className="text-xs text-muted-foreground">{instructions}</p>
          )}
        </div>
        <div className="w-10" />
      </div>

      {/* Camera view or captured image */}
      <div className="flex-1 relative bg-black">
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-primary-foreground"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choisir depuis galerie
            </Button>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Canvas for capture (hidden) */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* File input for fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Frame guide */}
        {!capturedImage && !error && (
          <div className="absolute inset-8 border-2 border-white/30 rounded-xl pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-background safe-area-bottom">
        {capturedImage ? (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleRetake}
              className="flex-1 h-14 rounded-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reprendre
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground"
            >
              <Check className="w-5 h-5 mr-2" />
              Valider
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-14 w-14 rounded-full"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={handleCapture}
              disabled={!!error}
              className="h-20 w-20 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
              <Camera className="w-8 h-8" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFacingMode}
              className="h-14 w-14 rounded-full"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
