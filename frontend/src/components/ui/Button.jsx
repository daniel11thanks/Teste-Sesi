import { Link } from 'react-router-dom'
import Icon from './Icon'
import './Button.css'

/**
 * Botão/link no estilo do Figma.
 * variant: 'light' (branco, sobre fundo vermelho) | 'dark' (preto) | 'outline' (contorno, discreto).
 * Com `to`, renderiza um link do React Router; sem `to`, um <button>.
 */
export default function Button({ to, variant = 'light', arrow = false, children, className = '', ...rest }) {
  const classe = `btn btn--${variant} ${className}`.trim()
  const conteudo = (
    <>
      {children}
      {arrow && <Icon name="arrow-navigation-1" size={20} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classe} {...rest}>
        {conteudo}
      </Link>
    )
  }
  return (
    <button type="button" className={classe} {...rest}>
      {conteudo}
    </button>
  )
}
