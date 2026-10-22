import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Header.css'

const LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/cursos', label: 'Cursos' },
  { to: '/#sobre', label: 'Sobre' },
]

/**
 * Cabeçalho do site.
 * - `overlay`: fica fixo sobre o hero, transparente no topo e branco depois de rolar (Landing).
 * - sem `overlay`: fundo branco, acompanha o fluxo da página (demais telas).
 */
export default function Header({ overlay = false }) {
  const [rolou, setRolou] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    if (!overlay) return undefined
    const atualizar = () => setRolou(window.scrollY > 8)
    atualizar()
    window.addEventListener('scroll', atualizar, { passive: true })
    return () => window.removeEventListener('scroll', atualizar)
  }, [overlay])

  useEffect(() => {
    if (!menuAberto) return undefined
    const fecharComEsc = (e) => e.key === 'Escape' && setMenuAberto(false)
    document.addEventListener('keydown', fecharComEsc)
    return () => document.removeEventListener('keydown', fecharComEsc)
  }, [menuAberto])

  const claro = overlay && !rolou && !menuAberto
  const classe = ['header', overlay && 'header--overlay', claro && 'header--claro', menuAberto && 'header--aberto']
    .filter(Boolean)
    .join(' ')

  const fechar = () => setMenuAberto(false)

  return (
    <header className={classe}>
      <div className="container header__inner">
        <Link to="/" className="header__logo" aria-label="SESI Indústria, ir para o início" onClick={fechar}>
          <img
            src={claro ? '/assets/logo-sesi-industria-white.svg' : '/assets/logo-sesi-industria-primary.svg'}
            alt=""
            width="188"
            height="19"
          />
        </Link>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto((v) => !v)}
        >
          <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuAberto ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        <nav id="menu-principal" className="header__nav" aria-label="Principal">
          <ul className="header__list">
            {LINKS.map((item) => (
              <li key={item.label}>
                <NavLink to={item.to} end={item.end} className="header__link" onClick={fechar}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/ava/1" className="header__button" onClick={fechar}>
                Área do aluno
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
