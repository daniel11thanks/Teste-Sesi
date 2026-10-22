import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { listarCursos, obterFiltros } from '../services/api'
import { rotuloQuantidade } from '../utils/formatar'
import CourseFilters from '../components/courses/CourseFilters'
import CourseListCard from '../components/courses/CourseListCard'
import { EmptyState, ErrorMessage, Loading } from '../components/ui/Feedback'
import './Catalogo.css'

const ATRASO_BUSCA_MS = 300
const CHAVES = ['categoria', 'modalidade', 'status']

/**
 * Catálogo de cursos. Os filtros vivem na URL (?busca=&categoria=&modalidade=&status=),
 * então o botão Voltar e links compartilhados reproduzem a mesma pesquisa.
 */
export default function Catalogo() {
  useDocumentTitle('Catálogo de cursos')
  const [params, setParams] = useSearchParams()
  const busca = params.get('busca') ?? ''
  const filtros = {
    busca,
    categoria: params.get('categoria') ?? '',
    modalidade: params.get('modalidade') ?? '',
    status: params.get('status') ?? '',
  }
  const temFiltros = Object.values(filtros).some(Boolean)

  // O texto digitado é local; a URL (e a chamada à API) só mudam após uma pausa na digitação.
  const [texto, setTexto] = useState(busca)

  useEffect(() => {
    if (texto.trim() === busca) return undefined
    const espera = setTimeout(() => atualizar('busca', texto.trim(), true), ATRASO_BUSCA_MS)
    return () => clearTimeout(espera)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto])

  // Voltar/limpar mudam a URL por fora: o campo acompanha.
  useEffect(() => {
    setTexto((atual) => (atual.trim() === busca ? atual : busca))
  }, [busca])

  // A busca é aplicada por um temporizador que guarda uma versão antiga desta função. O setSearchParams do
  // React Router não enfileira atualizações funcionais, então partimos sempre da URL mais recente (ref);
  // senão a busca atrasada apagaria os filtros escolhidos nesse meio-tempo.
  const paramsAtuais = useRef(params)
  paramsAtuais.current = params

  function atualizar(chave, valor, substituir = false) {
    const proximo = new URLSearchParams(paramsAtuais.current)
    if (valor) proximo.set(chave, valor)
    else proximo.delete(chave)
    paramsAtuais.current = proximo
    setParams(proximo, { replace: substituir })
  }

  function limpar() {
    setTexto('')
    setParams({}, { replace: false })
    document.getElementById('busca')?.focus()
  }

  const opcoes = useAsync((signal) => obterFiltros(signal), []).data
  const { data, loading, error, reload } = useAsync(
    (signal) => listarCursos(filtros, signal),
    [filtros.busca, filtros.categoria, filtros.modalidade, filtros.status],
  )

  const cursos = data?.itens ?? []

  return (
    <main id="conteudo" className="catalog">
      <section className="catalog__intro">
        <div className="container">
          <h1 className="catalog__title">Catálogo de cursos</h1>
          <p className="catalog__subtitle">
            Pesquise pelo nome e filtre por categoria, modalidade ou status para encontrar o curso ideal para a sua
            carreira na indústria.
          </p>
        </div>
      </section>

      <div className="container catalog__content">
        <CourseFilters
          texto={texto}
          onTexto={setTexto}
          valores={filtros}
          onFiltro={(chave, valor) => CHAVES.includes(chave) && atualizar(chave, valor)}
          opcoes={opcoes}
          onLimpar={limpar}
          temFiltros={temFiltros || texto.trim() !== ''}
        />

        <section className="catalog__results" aria-labelledby="resultados" aria-busy={loading}>
          <h2 id="resultados" className="sr-only">
            Resultados
          </h2>

          {/* Anuncia a quantidade (ou o estado) para leitores de tela a cada nova pesquisa. */}
          <p className="catalog__count" role="status" aria-live="polite">
            {loading && 'Buscando cursos...'}
            {!loading && !error && data && rotuloQuantidade(data.total)}
          </p>

          {loading && !data && <Loading message="Carregando cursos..." />}

          {error && <ErrorMessage error={error} onRetry={reload} />}

          {!error && data && data.total === 0 && (
            <EmptyState
              title="Nenhum curso encontrado"
              action={
                temFiltros && (
                  <button type="button" className="catalog__reset" onClick={limpar}>
                    Limpar filtros
                  </button>
                )
              }
            >
              Não encontramos cursos com a pesquisa e os filtros escolhidos. Tente outro nome ou remova algum filtro.
            </EmptyState>
          )}

          {!error && cursos.length > 0 && (
            <ul className={`catalog__grid${loading ? ' catalog__grid--loading' : ''}`}>
              {cursos.map((curso) => (
                <CourseListCard key={curso.id} curso={curso} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
