import { Link } from 'react-router-dom'
import './Footer.css'

const NAVEGACAO = [
  { label: 'Início', to: '/' },
  { label: 'Certificação', to: '/#certificacao' },
  { label: 'Cursos', to: '/cursos' },
  { label: 'Sobre', to: '/#sobre' },
  { label: 'Blog', to: '/' },
]

const CURSOS_POPULARES = [
  'Cultura Organizacional',
  'Ferramentas Google para Produtividade',
  'Excel Básico ao Avançado',
  'Trabalho em Equipe e Colaboração',
  'Gestão do Tempo e Produtividade',
  'Comunicação Assertiva',
  'Inteligência Emocional no Trabalho',
]

const SUPORTE = ['Termos de Uso', 'Política de Privacidade', 'Trabalhe Conosco', 'Fale Conosco', 'Central de Ajuda']

const REDES = [
  { nome: 'LinkedIn', icone: 'icon-linkedIn-24px.svg', href: 'https://www.linkedin.com/' },
  { nome: 'Instagram', icone: 'icon-instagram-24px.svg', href: 'https://www.instagram.com/' },
  { nome: 'Facebook', icone: 'icon-facebook-24px.svg', href: 'https://www.facebook.com/' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/assets/logo-sesi-industria-white.svg" alt="SESI Indústria" width="188" height="19" />
            <address className="footer__address">
              <a href="mailto:contato@sesindustria.com.br">contato@sesindustria.com.br</a>
              <span>Av. Paulista, 1313</span>
            </address>
          </div>

          <nav aria-labelledby="footer-navegacao">
            <h2 id="footer-navegacao" className="footer__title">
              Navegação
            </h2>
            <ul className="footer__list">
              {NAVEGACAO.map((item) => (
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-cursos">
            <h2 id="footer-cursos" className="footer__title">
              Cursos populares
            </h2>
            <ul className="footer__list">
              {CURSOS_POPULARES.map((nome) => (
                <li key={nome}>
                  <Link to="/cursos">{nome}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-suporte">
            <h2 id="footer-suporte" className="footer__title">
              Suporte
            </h2>
            <ul className="footer__list">
              {SUPORTE.map((nome) => (
                <li key={nome}>
                  <Link to="/">{nome}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            <img src="/assets/logo-sesi.svg" alt="SESI" width="57" height="19" />
            <span>Todos os direitos reservados.</span>
          </p>
          <ul className="footer__social">
            {REDES.map((rede) => (
              <li key={rede.nome}>
                <a href={rede.href} target="_blank" rel="noopener noreferrer" aria-label={`${rede.nome} (abre em nova aba)`}>
                  <img src={`/assets/${rede.icone}`} alt="" width="24" height="24" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
