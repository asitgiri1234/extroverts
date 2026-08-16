import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Landing } from '@/routes/Landing'
import { Terms } from '@/routes/Terms'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-center"
        theme="dark"
        richColors
        toastOptions={{ style: { fontFamily: "'Poppins', sans-serif" } }}
      />
    </BrowserRouter>
  )
}
