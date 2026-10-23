import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import './Carousel.css'

// Deslocamento mínimo (px) para um clique virar arrasto: abaixo disso é um clique normal (abre o card).
const LIMITE_ARRASTO = 5

// Inércia ao soltar (como no Figma): a trilha continua deslizando com a velocidade do arrasto e perde velocidade aos poucos.
const JANELA_VELOCIDADE_MS = 100 // só os últimos instantes do arrasto contam para a velocidade
const VELOCIDADE_MINIMA = 0.15 // px/ms; abaixo disso o arrasto termina sem inércia
const VELOCIDADE_MAXIMA = 4 // px/ms; evita lançamentos exagerados
const ATRITO = 0.0035 // por ms: a velocidade cai exponencialmente; o deslize projetado é velocidade/ATRITO (v = 1 px/ms ≈ 285 px)

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
  const [deslizando, setDeslizando] = useState(false)
  const quadro = useRef(0)
  const amostras = useRef([])
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

  const pararInercia = useCallback(() => {
    if (!quadro.current) return
    cancelAnimationFrame(quadro.current)
    quadro.current = 0
    setDeslizando(false)
  }, [])

  useEffect(() => pararInercia, [pararInercia])

  // A inércia já termina no card de destino (em vez de parar em qualquer ponto e dar um "tranco" quando o snap volta):
  // projeta onde a trilha pararia, escolhe o ponto de encaixe mais próximo nessa direção e desacelera até ele.
  const deslizar = (velocidadeInicial) => {
    const el = trilha.current
    const inicio = el.scrollLeft
    const maximo = el.scrollWidth - el.clientWidth
    const recuo = parseFloat(getComputedStyle(el).paddingLeft)
    const pontos = [...el.children].map((li) => li.offsetLeft - recuo).filter((x) => x >= 0 && x < maximo)
    pontos.push(0, maximo)

    const sentido = Math.sign(velocidadeInicial)
    const projetado = Math.min(Math.max(inicio + velocidadeInicial / ATRITO, 0), maximo)
    const adiante = pontos.filter((x) => (x - inicio) * sentido > 1)
    const candidatos = adiante.length ? adiante : pontos
    const alvo = candidatos.reduce((melhor, x) => (Math.abs(x - projetado) < Math.abs(melhor - projetado) ? x : melhor))
    const distancia = alvo - inicio
    if (Math.abs(distancia) < 1) return

    // pos(t) = alvo − distância·e^(−k·t): começa com a velocidade do arrasto (k = v/distância) e chega suave ao alvo.
    const k = Math.min(Math.max(Math.abs(velocidadeInicial) / Math.abs(distancia), 0.002), 0.03)
    const comeco = performance.now()
    setDeslizando(true)

    const passo = (agora) => {
      const restante = distancia * Math.exp(-k * (agora - comeco))
      if (Math.abs(restante) < 0.5) {
        el.scrollLeft = alvo
        quadro.current = 0
        setDeslizando(false)
        return
      }
      el.scrollLeft = alvo - restante
      quadro.current = requestAnimationFrame(passo)
    }
    quadro.current = requestAnimationFrame(passo)
  }

  const mover = (direcao) => {
    pararInercia()
    const el = trilha.current
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direcao * el.clientWidth * 0.8, behavior: reduzir ? 'auto' : 'smooth' })
  }

  // Arrastar com o mouse: o conteúdo acompanha o ponteiro. O snap é desligado durante o arrasto (via classe) e,
  // ao soltar, volta a valer e o carrossel assenta no card mais próximo.
  const iniciarArrasto = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    pararInercia() // tocar na trilha enquanto desliza a segura
    amostras.current = [{ t: e.timeStamp, x: e.clientX }]
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
    amostras.current.push({ t: e.timeStamp, x: e.clientX })
    while (amostras.current.length > 2 && e.timeStamp - amostras.current[0].t > JANELA_VELOCIDADE_MS) amostras.current.shift()
  }

  const terminarArrasto = (e) => {
    const a = arrasto.current
    if (!a.ativo) return
    a.ativo = false
    if (a.moveu) {
      a.suprimirClique = true // o clique que o navegador gera ao soltar não deve abrir o card sob o ponteiro
      setArrastando(false)
      iniciarInercia(e)
    }
  }

  const iniciarInercia = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pontos = amostras.current
    const ultimo = pontos[pontos.length - 1]
    // Se o ponteiro ficou parado antes de soltar, não há velocidade para continuar.
    if (!ultimo || e.timeStamp - ultimo.t > JANELA_VELOCIDADE_MS) return
    const primeiro = pontos[0]
    const dt = ultimo.t - primeiro.t
    if (dt <= 0) return
    const v = -(ultimo.x - primeiro.x) / dt // arrastar para a esquerda rola para a direita
    if (Math.abs(v) < VELOCIDADE_MINIMA) return
    deslizar(Math.sign(v) * Math.min(Math.abs(v), VELOCIDADE_MAXIMA))
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
        className={`carousel__track${arrastando ? ' carousel__track--arrastando' : ''}${deslizando ? ' carousel__track--deslizando' : ''}`}
        ref={trilha}
        onScroll={atualizar}
        onPointerDown={iniciarArrasto}
        onPointerMove={moverArrasto}
        onPointerUp={terminarArrasto}
        onPointerCancel={terminarArrasto}
        onClickCapture={bloquearCliqueAposArrasto}
        onWheel={pararInercia}
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
