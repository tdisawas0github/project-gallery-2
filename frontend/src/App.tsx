import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Analytics } from './pages/Analytics'
import { ApiKeys } from './pages/ApiKeys'
import { Dashboard } from './pages/Dashboard'
import { Logs } from './pages/Logs'
import { Models } from './pages/Models'
import { Providers } from './pages/Providers'
import { Routes as RoutesPage } from './pages/Routes'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="models" element={<Models />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="logs" element={<Logs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="providers" element={<Providers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}