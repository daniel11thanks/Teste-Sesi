import { useAsync } from '../hooks/useAsync'
import { listarCursos } from '../services/api'
import { ErrorMessage, Loading } from '../components/ui/Feedback'

/** Página provisória que valida a integração front-end → API. Será substituída pelas telas do Figma. */
export default function Placeholder({ titulo }) {
  const { data, loading, error, reload } = useAsync((signal) => listarCursos({}, signal), [])

  return (
    <main id="conteudo" className="container" style={{ paddingBlock: '3rem' }}>
      <h1>{titulo}</h1>
      {loading && !data && <Loading />}
      {error && <ErrorMessage error={error} onRetry={reload} />}
      {data && <p>API conectada: {data.total} cursos disponíveis.</p>}
    </main>
  )
}
