import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {AuthProvider} from "./auth/AuthProvider.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
)
