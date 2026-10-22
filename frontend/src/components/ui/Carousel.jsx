import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import './Carousel.css'

/**
 * Carrossel horizontal por rolagem (scroll-snap) com botões Anterior/Próximo.
 * Os itens (`children`) devem ser <li>. `footer` ocupa o canto esquerdo da linha dos botões.
 * variant: 'light' (setas pretas, fundo claro) | 'dark' (setas brancas, fundo escuro).
 */
export default function Carousel({ label, children, footer = null, variant = 'light' }) {
  const trilha = useRef(null)
  const [podeVoltar, setPodeVoltar] = useState(false)
  const [podeAvancar, setPodeAvancar] = useState(true)

  const atualizar = useCallback(() => {
    const el = trilha.current
    if (!el) return
    setPodeVoltar(el.scrollLeft > 4)
    setPodeAvancar(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    atualizar()
    const el = trilha.current
    const observador = new ResizeObserver(atualizar)
    observador.observe(el)
    return () => observador.disconnect()
  }, [atualizar, children])

  const mover = (direcao) => {
    const el = trilha.current
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direcao * el.clientWidth * 0.8, behavior: reduzir ? 'auto' : 'smooth' })
  }

  return (
    <div className={`carousel carousel--${variant}`} role="region" aria-roledescription="carrossel" aria-label={label}>
      <ul className="carousel__track" ref={trilha} onScroll={atualizar}>
        {children}
      </ul>

      <div className="container carousel__controls">
        <div>{footer}</div>
        <div className="carousel__arrows">
          <button type="button" className="carousel__arrow" onClick={() => mover(-1)} disabled={!podeVoltar}>
            <Icon name="arrow-navigation" size={40} />
            <span className="sr-only">Anterior</span>
          </button>
          <button type="button" className="carousel__arrow" onClick={() => mover(1)} disabled={!podeAvancar}>
            <Icon name="arrow-navigation-1" size={40} />
            <span className="sr-only">Próximo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
