"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Download, CheckCircle, XCircle } from "lucide-react"

interface BulkUploadDialogProps {
  trigger: React.ReactNode
}

export function BulkUploadDialog({ trigger }: BulkUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    success: number
    errors: string[]
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setResults(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Mock results
    setResults({
      success: 15,
      errors: ["Línea 3: Precio inicial inválido", "Línea 7: Categoría no reconocida"],
    })

    setUploading(false)
  }

  const downloadTemplate = () => {
    // In a real app, this would download an actual CSV template
    const csvContent = `titulo,descripcion,categoria,precio_inicial,incremento,fecha_inicio,hora_inicio,duracion
"Arte Contemporáneo","Obra de arte moderna","arte",5000,500,"2024-01-15","14:00",60
"Reloj Vintage","Reloj de colección","joyeria",2000,200,"2024-01-16","16:00",90`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "plantilla_subastas.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Carga Masiva de Productos</DialogTitle>
          <DialogDescription>Sube un archivo CSV para crear múltiples subastas de una vez</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!results && (
            <>
              <div className="space-y-2">
                <Label htmlFor="csv-file">Archivo CSV</Label>
                <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} />
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  El archivo debe incluir las columnas: titulo, descripcion, categoria, precio_inicial, incremento,
                  fecha_inicio, hora_inicio, duracion
                </AlertDescription>
              </Alert>

              <Button variant="outline" onClick={downloadTemplate} className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Descargar Plantilla CSV
              </Button>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Procesando archivo...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Procesando..." : "Subir Archivo"}
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </>
          )}

          {results && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Carga Completada</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800">Subastas creadas exitosamente</span>
                  <Badge className="bg-green-100 text-green-800">{results.success}</Badge>
                </div>

                {results.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Errores encontrados:</span>
                    </div>
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={() => setIsOpen(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
