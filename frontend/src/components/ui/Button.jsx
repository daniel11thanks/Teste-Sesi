import { Link } from 'react-router-dom'
import Icon from './Icon'
import './Button.css'

/**
 * Botão/link no estilo do Figma.
 * variant: 'light' (branco, sobre fundo vermelho) | 'dark' (preto) | 'outline' (contorno, discreto).
 * Com `to`, renderiza um link do React Router; com `href`, um <a> comum (mailto, externo); sem os dois, um <button>.
 */
export default function Button({ to, href, variant = 'light', arrow = false, children, className = '', ...rest }) {
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
  if (href) {
    return (
      <a href={href} className={classe} {...rest}>
        {conteudo}
      </a>
    )
  }
  return (
    <button type="button" className={classe} {...rest}>
      {conteudo}
    </button>
  )
}
