import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SiteProvider } from './context/SiteContext.jsx'
import { UIProvider } from './components/ui.jsx'
import './styles.css'
createRoot(document.getElementById('root')).render(
  <BrowserRouter><UIProvider><AuthProvider><SiteProvider><App /></SiteProvider></AuthProvider></UIProvider></BrowserRouter>)
