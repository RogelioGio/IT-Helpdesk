import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { Toaster } from 'sonner'
import { AuthContextProvider } from './contexts/AuthProvider'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  // </StrictMode>
    <AuthContextProvider>
      <Toaster
        toastOptions={{
          // style:{
          //   border: "1px solid #d1d5dc",
          //   fontFamily: "Google Sans, sans-serif",
          //   backgroundColor: "#f9fafb",
          //   color: "#111827",
          //   filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 1))",
          // }
        }}/>
      <RouterProvider router={router}/>
    </AuthContextProvider>
)
