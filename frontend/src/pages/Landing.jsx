import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { listarCursos } from '../services/api'
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import { ErrorMessage, Loading } from '../components/ui/Feedback'
import CourseCard, { AllCoursesCard } from '../components/courses/CourseCard'
import Testimonials from '../components/testimonials/Testimonials'
import './Landing.css'

const ESTATISTICAS = [
  { valor: '25.000+', rotulo: 'Profissionais Capacitados' },
  { valor: '500+', rotulo: 'Empresas parceiras' },
  { valor: '4.8/5', rotulo: 'Avaliação média' },
  { valor: '2.5M+', rotulo: 'Horas de capacitação' },
]

const BENEFICIOS = [
  {
    icone: '01-certificacao-red',
    titulo: 'Certificação SESI',
    texto: 'Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.',
  },
  {
    icone: '02-professores-red',
    titulo: 'Professores especialistas',
    texto: 'Contamos com professores reconhecidos por sua excelência no mercado.',
  },
  {
    icone: '03-suporte-red',
    titulo: 'Suporte contínuo',
    texto: 'Você não está sozinho! Acompanhamento online durante todo o curso.',
  },
]

const QTD_DESTAQUES = 6

export default function Landing() {
  useDocumentTitle('Impulsione sua carreira na indústria')

  return (
    <main id="conteudo">
      <Hero />
      <CursosEmDestaque />
      <Impacto />
      <Testimonials variant="dark" />
      <ChamadaFinal />
    </main>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="titulo-hero">
      <div className="container hero__inner">
        <h1 id="titulo-hero" className="hero__title">
          Impulsione sua carreira na indústria
        </h1>
        <p className="hero__text">
          Amplie seus conhecimentos com excelência na melhor plataforma de estudos da indústria brasileira
        </p>
        <Button to="/#cursos" arrow>
          Conhecer cursos
        </Button>
      </div>
    </section>
  )
}

function CursosEmDestaque() {
  const { data, loading, error, reload } = useAsync((signal) => listarCursos({}, signal), [])
  const destaques = data?.itens.slice(0, QTD_DESTAQUES) ?? []

  return (
    <section id="cursos" className="featured" aria-labelledby="titulo-cursos">
      <div className="container">
        <h2 id="titulo-cursos" className="section-title">
          Principais cursos
        </h2>
      </div>

      {loading && !data && <Loading message="Carregando cursos..." />}
      {error && (
        <div className="container">
          <ErrorMessage error={error} onRetry={reload} />
        </div>
      )}
      {data && (
        <Carousel
          label="Cursos em destaque"
          footer={
            <Button to="/cursos" variant="outline">
              Ver todos os cursos
            </Button>
          }
        >
          {destaques.map((curso) => (
            <CourseCard key={curso.id} curso={curso} />
          ))}
          <AllCoursesCard />
        </Carousel>
      )}
    </section>
  )
}

function Impacto() {
  return (
    <section id="sobre" className="impact" aria-labelledby="titulo-impacto">
      <div className="container impact__grid">
        <div>
          <h2 id="titulo-impacto" className="section-title">
            Impacto transformador
          </h2>
          <p className="impact__text">
            Resultados que demonstram o sucesso da nossa metodologia de capacitação contínua para a indústria
          </p>
        </div>

        <div>
          <dl className="stats">
            {ESTATISTICAS.map((e) => (
              <div key={e.rotulo} className="stats__row">
                <dd className="stats__value">{e.valor}</dd>
                <dt className="stats__label">{e.rotulo}</dt>
              </div>
            ))}
          </dl>

          <ul id="certificacao" className="benefits">
            {BENEFICIOS.map((b) => (
              <li key={b.titulo} className="benefit">
                <span className="benefit__icon">
                  <img src={`/assets/${b.icone}.svg`} alt="" width="24" height="24" />
                </span>
                <h3 className="benefit__title">{b.titulo}</h3>
                <p className="benefit__text">{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ChamadaFinal() {
  return (
    <section className="cta" aria-labelledby="titulo-cta">
      <div className="container cta__grid">
        <div>
          <h2 id="titulo-cta" className="cta__title">
            Pronto para transformar sua carreira?
          </h2>
          <p className="cta__text">
            Junte-se a milhares de profissionais que já estão transformando a indústria através dos nossos cursos.
            Invista no seu futuro hoje mesmo!
          </p>
          <Button to="/cursos/1" arrow>
            Matricule-se
          </Button>
        </div>

        <figure className="cta__video">
          <img src="/assets/video-thumb.webp" alt="Profissionais da indústria durante um treinamento" loading="lazy" />
          <span className="cta__play" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </figure>
      </div>
    </section>
  )
}
