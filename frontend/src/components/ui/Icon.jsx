import './Icon.css'

/**
 * Ícone a partir dos SVGs fornecidos no Figma, usados como máscara: assim herdam a cor do texto
 * (currentColor) e funcionam em fundos claros e escuros. É decorativo (aria-hidden).
 */
export default function Icon({ name, size = 16, className = '' }) {
  return (
    <span
      className={`icon ${className}`.trim()}
      aria-hidden="true"
      style={{ '--icon': `url(/assets/${name}.svg)`, '--icon-size': typeof size === 'number' ? `${size}px` : size }}
    />
  )
}
