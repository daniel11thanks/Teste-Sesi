import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ApiError, obterCurso } from '../services/api'
import { formatarCargaHoraria, formatarData } from '../utils/formatar'
import Accordion from '../components/ui/Accordion'
import Button from '../components/ui/Button'
import CategoryTag from '../components/ui/CategoryTag'
import { EmptyState, ErrorMessage, Loading } from '../components/ui/Feedback'
import { CalendarGlyph, ClockGlyph, MedalGlyph, ModeGlyph, UsersGlyph } from '../components/ui/Glyphs'
import StatusBadge from '../components/ui/StatusBadge'
import Testimonials from '../components/testimonials/Testimonials'
import './CursoDetalhe.css'

const BENEFICIOS = [
  {
    icone: '01-certificacao-bege',
    titulo: 'Certificação SESI',
    texto: 'Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.',
  },
  {
    icone: '02-professores-bege',
    titulo: 'Professores especialistas',
    texto: 'Contamos com professores reconhecidos por sua excelência no mercado.',
  },
  {
    icone: '03-suporte-bege',
    titulo: 'Suporte contínuo',
    texto: 'Você não está sozinho! Acompanhamento online durante todo o curso.',
  },
  {
    icone: '04-flexibilidade-bege',
    titulo: 'Flexibilidade',
    texto: 'Turmas presenciais e online com horários que se adaptam à sua rotina.',
  },
]

const EMAIL_CONTATO = 'contato@sesindustria.com.br'

export default function CursoDetalhe() {
  const { id } = useParams()
  const idValido = /^\d+$/.test(id)

  const { data: curso, loading, error, reload } = useAsync(
    (signal) => (idValido ? obterCurso(id, signal) : Promise.reject(new ApiError('Curso não encontrado.', 404))),
    [id],
  )

  useDocumentTitle(curso?.nomeBreve ?? 'Curso')

  if (error?.status === 404) {
    return (
      <main id="conteudo" className="container detail__state">
        <EmptyState
          nivel={1}
          title="Curso não encontrado"
          action={
            <Button to="/cursos" variant="dark">
              Ver todos os cursos
            </Button>
          }
        >
          O curso que você procura não existe ou foi removido do catálogo.
        </EmptyState>
      </main>
    )
  }

  if (error) {
    return (
      <main id="conteudo" className="container detail__state">
        <ErrorMessage error={error} onRetry={reload} nivel={1} />
      </main>
    )
  }

  if (loading || !curso) {
    return (
      <main id="conteudo" className="container detail__state">
        <Loading message="Carregando curso..." />
      </main>
    )
  }

  return (
    <main id="conteudo" className="detail">
      <Hero curso={curso} />
      <Beneficios />
      <SobreOCurso curso={curso} />
      <Testimonials variant="light" />
      <FaleConosco nome={curso.nomeBreve} />
      <BarraMatricula curso={curso} />
    </main>
  )
}

function Hero({ curso }) {
  const inicio = formatarData(curso.dataDisponibilizacao)

  return (
    <section className="container detail-hero" aria-labelledby="titulo-curso">
      <div className="detail-hero__info">
        <div className="detail-hero__tags">
          <CategoryTag categoria={curso.categoria} />
        </div>

        <h1 id="titulo-curso" className="detail-hero__title">
          {curso.nomeCompleto}
        </h1>

        <ul className="detail-hero__facts">
          {inicio && (
            <li>
              <CalendarGlyph />
              <span>
                Início do curso: <strong>{inicio}</strong>
              </span>
            </li>
          )}
          <li>
            <MedalGlyph />
            <span>
              Certificação: <strong>SESI</strong>
            </span>
          </li>
        </ul>

        <BotaoMatricula curso={curso} variant="dark" />
      </div>

      <figure className="detail-hero__video">
        <img src="/assets/video-thumb.webp" alt="Profissionais da indústria durante um treinamento" />
        <span className="detail-hero__play" aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </figure>
    </section>
  )
}

/** Botão de matrícula conforme o status: só cursos disponíveis aceitam matrícula. */
function BotaoMatricula({ curso, variant }) {
  if (curso.status.valor === 'Disponivel') {
    return (
      <Button to={`/ava/${curso.id}`} variant={variant} arrow>
        Matricule-se
      </Button>
    )
  }

  const inicio = formatarData(curso.dataDisponibilizacao)
  const rotulo = curso.status.valor === 'EmBreve' ? `Disponível em ${inicio ?? 'breve'}` : 'Inscrições encerradas'
  return (
    <Button variant={variant} disabled>
      {rotulo}
    </Button>
  )
}

function Beneficios() {
  return (
    <section className="container benefits-row" aria-labelledby="titulo-diferenciais">
      <h2 id="titulo-diferenciais" className="sr-only">
        Diferenciais
      </h2>
      <ul className="detail-benefits">
        {BENEFICIOS.map((b) => (
          <li key={b.titulo}>
            <img className="detail-benefits__icon" src={`/assets/${b.icone}.svg`} alt="" width="52" height="52" />
            <h3>{b.titulo}</h3>
            <p>{b.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SobreOCurso({ curso }) {
  const tituloAulas = curso.modalidade.valor === 'Online' ? 'Aulas online e avaliações' : 'Aulas e avaliações'

  const itens = [
    {
      id: 'modulos',
      titulo: 'Módulos',
      conteudo: (
        <ol className="syllabus">
          {curso.modulos.map((m) => (
            <li key={m.ordem}>
              <h4>
                {m.ordem}. {m.titulo}
              </h4>
              <ul className="bullets">
                {m.topicos.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: 'aulas',
      titulo: tituloAulas,
      conteudo: (
        <div className="syllabus">
          {curso.secoes.map((s) => (
            <section key={s.titulo}>
              <h4>{s.titulo}</h4>
              <p>{s.introducao}</p>
              <ul className="bullets">
                {s.itens.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              {s.fechamento && <p>{s.fechamento}</p>}
            </section>
          ))}
        </div>
      ),
    },
    {
      id: 'duvidas',
      titulo: 'Dúvidas frequentes',
      conteudo: (
        <div className="syllabus">
          {curso.faqs.map((f) => (
            <section key={f.ordem}>
              <h4>
                {f.ordem}. {f.pergunta}
              </h4>
              <p>{f.resposta}</p>
            </section>
          ))}
        </div>
      ),
    },
  ]

  return (
    <section className="container about-section" aria-labelledby="titulo-sobre">
      <div className="about">
        {/* Como no Figma, esta coluna fica fixa no topo enquanto o conteúdo dos acordeões rola ao lado. */}
        <div className="about__fixed">
          <h2 id="titulo-sobre" className="about__title">
            Sobre o curso
          </h2>
          <p className="about__text">{curso.sobre}</p>
        </div>
        <Accordion items={itens} />
      </div>
      <InformacoesDoCurso curso={curso} />
    </section>
  )
}

/**
 * Dados do curso que o enunciado pede e o Figma não mostra (descrição, status, carga horária, modalidade e
 * público-alvo). Ficam numa faixa abaixo das duas colunas de "Sobre o curso": assim a coluna do texto, que é fixa na
 * rolagem como no protótipo, continua curta (uma coluna fixa mais alta que a tela teria o fim cortado) e nenhum
 * elemento do Figma muda de posição.
 */
function InformacoesDoCurso({ curso }) {
  return (
    <aside className="info" aria-labelledby="titulo-informacoes">
      <h3 id="titulo-informacoes" className="info__title">
        Informações do curso
      </h3>
      <dl className="info__list">
        <div className="info__wide">
          <dt>Descrição</dt>
          <dd>{curso.descricao}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={curso.status} />
          </dd>
        </div>
        <div>
          <dt>
            <ClockGlyph /> Carga horária
          </dt>
          <dd>{formatarCargaHoraria(curso.cargaHoraria)}</dd>
        </div>
        <div>
          <dt>
            <ModeGlyph /> Modalidade
          </dt>
          <dd>{curso.modalidade.rotulo}</dd>
        </div>
        <div>
          <dt>
            <UsersGlyph /> Público-alvo
          </dt>
          <dd>{curso.publicoAlvo}</dd>
        </div>
      </dl>
    </aside>
  )
}

function FaleConosco({ nome }) {
  const assunto = encodeURIComponent(`Dúvida sobre o curso: ${nome}`)
  return (
    <section className="contact" aria-labelledby="titulo-contato">
      <div className="container contact__inner">
        <p className="contact__label">Precisa de ajuda para decidir?</p>
        <h2 id="titulo-contato" className="contact__title">
          Fale com a gente
        </h2>
        <Button href={`mailto:${EMAIL_CONTATO}?subject=${assunto}`} arrow>
          Mandar uma mensagem
        </Button>
      </div>
    </section>
  )
}

/** Barra de matrícula fixa na base da tela (o Layout reserva espaço no rodapé para ela). */
function BarraMatricula({ curso }) {
  return (
    <div className="enroll-bar">
      <div className="container">
        <div className="enroll-bar__inner">
          <p className="enroll-bar__name">{curso.nomeCompleto}</p>
          <BotaoMatricula curso={curso} variant="light" />
        </div>
      </div>
    </div>
  )
}
