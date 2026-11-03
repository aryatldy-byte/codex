import { Routes, Route, Navigate } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import Home from './pages/site/Home.jsx'
import About from './pages/site/About.jsx'
import Services from './pages/site/Services.jsx'
import WhyUs from './pages/site/WhyUs.jsx'
import Contact from './pages/site/Contact.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import Login from './pages/admin/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Inquiries from './pages/admin/Inquiries.jsx'
import Content from './pages/admin/Content.jsx'
import Settings from './pages/admin/Settings.jsx'
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="content" element={<Content />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
