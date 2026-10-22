import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Button from '../components/ui/Button'
import { EmptyState } from '../components/ui/Feedback'

/** Página exibida para qualquer endereço que não exista no site. */
export default function NaoEncontrada() {
  useDocumentTitle('Página não encontrada')

  return (
    <main id="conteudo" className="container" style={{ paddingBlock: '4rem', minHeight: '50vh' }}>
      <EmptyState
        nivel={1}
        title="Página não encontrada"
        action={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Button to="/" variant="dark">
              Ir para o início
            </Button>
            <Button to="/cursos" variant="outline">
              Ver todos os cursos
            </Button>
          </div>
        }
      >
        O endereço que você acessou não existe ou foi movido.
      </EmptyState>
    </main>
  )
}
