import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import './Carousel.css'

// Deslocamento mínimo (px) para um clique virar arrasto: abaixo disso é um clique normal (abre o card).
const LIMITE_ARRASTO = 5

/**
 * Carrossel horizontal por rolagem (scroll-snap) com botões Anterior/Próximo.
 * Também pode ser arrastado com o mouse (em telas de toque, a rolagem nativa já funciona).
 * Os itens (`children`) devem ser <li>. `footer` ocupa o canto esquerdo da linha dos botões.
 * variant: 'light' (setas pretas, fundo claro) | 'dark' (setas brancas, fundo escuro).
 */
export default function Carousel({ label, children, footer = null, variant = 'light' }) {
  const trilha = useRef(null)
  const [podeVoltar, setPodeVoltar] = useState(false)
  const [podeAvancar, setPodeAvancar] = useState(true)
  const [arrastando, setArrastando] = useState(false)
  const arrasto = useRef({ ativo: false, inicioX: 0, inicioScroll: 0, moveu: false, suprimirClique: false })

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

  // Arrastar com o mouse: o conteúdo acompanha o ponteiro. O snap é desligado durante o arrasto (via classe) e,
  // ao soltar, volta a valer e o carrossel assenta no card mais próximo.
  const iniciarArrasto = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    arrasto.current = { ativo: true, inicioX: e.clientX, inicioScroll: trilha.current.scrollLeft, moveu: false, suprimirClique: false }
  }

  const moverArrasto = (e) => {
    const a = arrasto.current
    if (!a.ativo) return
    const dx = e.clientX - a.inicioX
    if (!a.moveu) {
      if (Math.abs(dx) < LIMITE_ARRASTO) return
      a.moveu = true
      trilha.current.setPointerCapture(e.pointerId)
      setArrastando(true)
    }
    trilha.current.scrollLeft = a.inicioScroll - dx
  }

  const terminarArrasto = () => {
    const a = arrasto.current
    if (!a.ativo) return
    a.ativo = false
    if (a.moveu) {
      a.suprimirClique = true // o clique que o navegador gera ao soltar não deve abrir o card sob o ponteiro
      setArrastando(false)
    }
  }

  const bloquearCliqueAposArrasto = (e) => {
    if (arrasto.current.suprimirClique) {
      e.preventDefault()
      e.stopPropagation()
      arrasto.current.suprimirClique = false
    }
  }

  return (
    <div className={`carousel carousel--${variant}`} role="region" aria-roledescription="carrossel" aria-label={label}>
      <ul
        className={`carousel__track${arrastando ? ' carousel__track--arrastando' : ''}`}
        ref={trilha}
        onScroll={atualizar}
        onPointerDown={iniciarArrasto}
        onPointerMove={moverArrasto}
        onPointerUp={terminarArrasto}
        onPointerCancel={terminarArrasto}
        onClickCapture={bloquearCliqueAposArrasto}
        onDragStart={(e) => e.preventDefault()}
        tabIndex={0}
        aria-label={`Itens: ${label}`}
      >
        {children}
      </ul>

      <div className="container carousel__controls">
        <div>{footer}</div>
        <div className="carousel__arrows">
          <button type="button" className="carousel__arrow" onClick={() => mover(-1)} disabled={!podeVoltar}>
            <Icon name="arrow-navigation" size={48} />
            <span className="sr-only">Anterior</span>
          </button>
          <button type="button" className="carousel__arrow" onClick={() => mover(1)} disabled={!podeAvancar}>
            <Icon name="arrow-navigation-1" size={48} />
            <span className="sr-only">Próximo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
