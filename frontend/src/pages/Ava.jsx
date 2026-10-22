import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ApiError, obterCurso } from '../services/api'
import { normalizar } from '../utils/formatar'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { EmptyState, ErrorMessage, Loading } from '../components/ui/Feedback'
import { SearchGlyph } from '../components/ui/Glyphs'
import { conteudoDaAula } from './conteudoAula'
import './Ava.css'

const PROGRESSO = 10

/**
 * Ambiente virtual de aprendizagem (protótipo): menu do curso + conteúdo da aula "Boas práticas".
 * Não integra com o Moodle (fora do escopo); progresso e itens de aula são ilustrativos.
 */
export default function Ava() {
  const { id } = useParams()
  const idValido = /^\d+$/.test(id)

  const { data: curso, loading, error, reload } = useAsync(
    (signal) => (idValido ? obterCurso(id, signal) : Promise.reject(new ApiError('Curso não encontrado.', 404))),
    [id],
  )

  useDocumentTitle(curso ? `Boas práticas · ${curso.nomeBreve}` : 'Ambiente de aprendizagem')

  if (error?.status === 404) {
    return (
      <main id="conteudo" className="ava-state">
        <EmptyState
          title="Curso não encontrado"
          action={
            <Button to="/cursos" variant="dark">
              Ver todos os cursos
            </Button>
          }
        >
          Não encontramos o curso para abrir o ambiente de aprendizagem.
        </EmptyState>
      </main>
    )
  }
  if (error) {
    return (
      <main id="conteudo" className="ava-state">
        <ErrorMessage error={error} onRetry={reload} />
      </main>
    )
  }
  if (loading || !curso) {
    return (
      <main id="conteudo" className="ava-state">
        <Loading message="Carregando ambiente de aprendizagem..." />
      </main>
    )
  }

  const { boasPraticas, recomendacoes } = conteudoDaAula(curso)

  return (
    <div className="ava">
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <Sidebar curso={curso} />

      <main id="conteudo" className="ava__content">
        <div className="ava__banner">
          <img src={curso.imagemUrl} alt="" />
          <img className="ava__banner-logo" src="/assets/logo-sesi.svg" alt="SESI" width="57" height="19" />
        </div>

        <article className="ava__article">
          <h1>Boas práticas</h1>
          {boasPraticas.map((p) => (
            <p key={p}>{p}</p>
          ))}

          <h2>Recomendações</h2>
          {recomendacoes.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </article>
      </main>
    </div>
  )
}

const ESTADOS = {
  concluida: { rotulo: 'concluída', glifo: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4z" fill="currentColor" stroke="none" /> },
  atual: {
    rotulo: 'aula atual',
    glifo: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 8.5v7l6-3.5z" fill="currentColor" />
      </>
    ),
  },
  pendente: { rotulo: 'não iniciada', glifo: <circle cx="12" cy="12" r="9" /> },
}

const AULAS_INTRODUCAO = [
  { rotulo: '1.1 Introdução', estado: 'concluida' },
  { rotulo: '1.2 Boas práticas', estado: 'atual' },
  { rotulo: '1.3 Extras', estado: 'pendente' },
]

function Sidebar({ curso }) {
  const [busca, setBusca] = useState('')
  const [menuAberto, setMenuAberto] = useState(false)
  const termo = normalizar(busca)

  const aulas = AULAS_INTRODUCAO.filter((a) => normalizar(a.rotulo).includes(termo))
  const modulos = curso.modulos
    .map((m) => ({ rotulo: `${m.ordem + 1}. Módulo ${m.ordem}`, ordem: m.ordem }))
    .filter((m) => normalizar(m.rotulo).includes(termo))
  const mostrarIntroducao = termo === '' || normalizar('1. Introdução').includes(termo) || aulas.length > 0
  const semResultado = !mostrarIntroducao && modulos.length === 0

  return (
    <aside className="ava__sidebar" aria-label="Conteúdo do curso">
      <div className="ava__top">
        <Link to={`/cursos/${curso.id}`} className="ava__back" aria-label="Voltar para a página do curso">
          <Icon name="arrow-navigation" size={24} />
        </Link>
      </div>

      <div className="ava__course">
        <p className="ava__label">Certificação</p>
        <p className="ava__course-title">{curso.nomeCompleto}</p>
      </div>

      <div className="ava__progress">
        <div
          className="ava__track"
          role="progressbar"
          aria-label="Progresso no curso"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={PROGRESSO}
        >
          <span style={{ width: `${PROGRESSO}%` }} />
        </div>
        <span aria-hidden="true">{PROGRESSO}%</span>
      </div>

      <button
        type="button"
        className="ava__toggle"
        aria-expanded={menuAberto}
        aria-controls="ava-menu"
        onClick={() => setMenuAberto((v) => !v)}
      >
        {menuAberto ? 'Ocultar conteúdo do curso' : 'Mostrar conteúdo do curso'}
      </button>

      <div id="ava-menu" className={`ava__menu${menuAberto ? ' is-open' : ''}`}>
        <div className="ava__search">
          <label htmlFor="ava-busca" className="sr-only">
            Buscar no conteúdo do curso
          </label>
          <input
            id="ava-busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoComplete="off"
          />
          <SearchGlyph width={14} height={14} />
        </div>

        <nav aria-label="Aulas e módulos">
          <ul className="ava__list">
            {mostrarIntroducao && (
              <li className="ava__group">
                <p>1. Introdução</p>
                <ul>
                  {aulas.map((a) => (
                    <li key={a.rotulo} aria-current={a.estado === 'atual' ? 'page' : undefined}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        {ESTADOS[a.estado].glifo}
                      </svg>
                      <span>
                        {a.rotulo}
                        <span className="sr-only"> ({ESTADOS[a.estado].rotulo})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            {modulos.map((m) => (
              <li key={m.ordem} className="ava__module">
                {m.rotulo}
              </li>
            ))}
          </ul>
          {semResultado && <p className="ava__empty">Nenhum item encontrado.</p>}
        </nav>
      </div>
    </aside>
  )
}
