import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/cursos" element={<Placeholder titulo="Catálogo de cursos" />} />
        <Route path="/cursos/:id" element={<Placeholder titulo="Detalhes do curso" />} />
        <Route path="/ava/:id" element={<Placeholder titulo="AVA" />} />
        <Route path="*" element={<Placeholder titulo="Página não encontrada" />} />
      </Route>
    </Routes>
  )
}
