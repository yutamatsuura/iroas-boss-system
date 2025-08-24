import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Members } from '@/pages/Members'
import { Payments } from '@/pages/Payments'
import { Reports } from '@/pages/Reports'
import { Login } from '@/pages/Login'
import { withAuth } from '@/contexts/AuthContext'

// Protected components
const ProtectedLayout = withAuth(Layout)

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

export default App