import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Ava from './pages/Ava'
import Catalogo from './pages/Catalogo'
import CursoDetalhe from './pages/CursoDetalhe'
import Landing from './pages/Landing'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/cursos" element={<Catalogo />} />
        <Route path="/cursos/:id" element={<CursoDetalhe />} />
        <Route path="*" element={<Placeholder titulo="Página não encontrada" />} />
      </Route>
      {/* O AVA tem layout próprio (menu lateral), sem o header e o footer do site. */}
      <Route path="/ava/:id" element={<Ava />} />
    </Routes>
  )
}
