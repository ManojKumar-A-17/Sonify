import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Mic2, Upload, FileText, X, Download, Loader2, ArrowLeft } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface PDFUploadResponse {
  audio_url: string
  text: string
  pages: number
  voice: string
}

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [lang, setLang] = useState('en')     // Changed from voice to lang  
  const [slow, setSlow] = useState(false)    // Changed from speed to slow
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const pdfFile = acceptedFiles[0]
      if (pdfFile.type !== 'application/pdf') {
        toast({
          title: 'Error',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        })
        return
      }
      setFile(pdfFile)
      setAudioUrl(null)
      setExtractedText(null)
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  })

  const pdfMutation = useMutation({
    mutationFn: async (): Promise<PDFUploadResponse> => {
      if (!file) throw new Error('No file selected')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('lang', lang)
      formData.append('slow', slow.toString())

      const response = await fetch(`${API_URL}/api/pdf`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || 'Failed to process PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      // Try to get text from response headers if available
      const text = response.headers.get('X-Extracted-Text') || 'Text extracted from PDF'
      
      return {
        audio_url: url,
        text,
        pages: 1,
        voice: lang, // Use lang instead of voice
      }
    },
    onSuccess: (data) => {
      setAudioUrl(data.audio_url)
      setExtractedText(data.text)
      toast({
        title: 'Success',
        description: 'PDF processed successfully!',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleProcess = () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      })
      return
    }

    pdfMutation.mutate()
  }

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = `sonify-pdf-${Date.now()}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const removeFile = () => {
    setFile(null)
    setAudioUrl(null)
    setExtractedText(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Mic2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sonify</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/text-to-speech">
                <Button variant="ghost">Text to Speech</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">PDF to Speech</h1>
            <p className="text-muted-foreground">
              Upload a PDF and convert it to natural-sounding audio
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload PDF</CardTitle>
                <CardDescription>
                  Drag and drop or click to select a PDF file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!file ? (
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      transition-colors
                      ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
                    `}
                  >
                    <input {...getInputProps()} id="pdf-file-upload" name="pdf-file" />
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    {isDragActive ? (
                      <p className="text-sm text-muted-foreground">Drop the PDF file here...</p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop a PDF file here, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Maximum file size: 10MB
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-10 w-10 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        disabled={pdfMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pdf-lang">Language</Label>
                  <Select 
                    value={lang} 
                    onValueChange={setLang}
                    disabled={pdfMutation.isPending}
                  >
                    <SelectTrigger id="pdf-lang">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdf-slow">Speed Mode</Label>
                  <Select 
                    value={slow ? 'slow' : 'normal'} 
                    onValueChange={(value) => setSlow(value === 'slow')}
                    disabled={pdfMutation.isPending}
                  >
                    <SelectTrigger id="pdf-slow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Speed</SelectItem>
                      <SelectItem value="slow">Slow Speed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleProcess}
                  disabled={pdfMutation.isPending || !file}
                  className="w-full"
                  size="lg"
                >
                  {pdfMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mic2 className="mr-2 h-4 w-4" />
                      Convert to Speech
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Audio Output</CardTitle>
                <CardDescription>
                  Preview and download your generated audio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pdfMutation.isPending && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing PDF...</span>
                      <span className="text-muted-foreground">Extracting text</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                )}

                {audioUrl && (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <audio
                        src={audioUrl}
                        controls
                        className="w-full"
                      />
                    </div>

                    {extractedText && (
                      <div className="p-4 bg-secondary/50 rounded-lg max-h-40 overflow-y-auto">
                        <p className="text-sm font-medium mb-2">Extracted Text Preview:</p>
                        <p className="text-xs text-muted-foreground">
                          {extractedText.substring(0, 200)}...
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <p className="text-muted-foreground mb-1">Language</p>
                        <p className="font-medium capitalize">{lang}</p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <p className="text-muted-foreground mb-1">Speed</p>
                        <p className="font-medium">{slow ? 'Slow' : 'Normal'}</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      size="lg"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Audio
                    </Button>
                  </div>
                )}

                {!audioUrl && !pdfMutation.isPending && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      Upload a PDF to generate audio
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>PDF Processing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Best results with text-based PDFs (not scanned images)</li>
                <li>• Keep PDF file size under 10MB for optimal processing</li>
                <li>• Complex layouts may affect text extraction order</li>
                <li>• Tables and charts will be converted to text descriptions</li>
                <li>• Processing time depends on PDF length and complexity</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
