import { Route, Routes } from 'react-router-dom'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Routes>
        <Route path="/" element={<Placeholder titulo="Landing" />} />
        <Route path="/cursos" element={<Placeholder titulo="Catálogo de cursos" />} />
        <Route path="/cursos/:id" element={<Placeholder titulo="Detalhes do curso" />} />
        <Route path="/ava/:id" element={<Placeholder titulo="AVA" />} />
        <Route path="*" element={<Placeholder titulo="Página não encontrada" />} />
      </Routes>
    </>
  )
}
