import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import TextToSpeech from './pages/TextToSpeech'
import PDFUpload from './pages/PDFUpload'
import NotFound from './pages/NotFound'
import { Toaster } from './components/ui/toaster'
import './App.css'

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/text-to-speech" element={<TextToSpeech />} />
        <Route path="/pdf-upload" element={<PDFUpload />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
