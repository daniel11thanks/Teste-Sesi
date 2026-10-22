import { estiloCategoria } from '../../utils/categorias'
import Icon from './Icon'
import './CategoryTag.css'

export default function CategoryTag({ categoria }) {
  const { icone, cor } = estiloCategoria(categoria.slug)
  return (
    <span className="tag" style={{ '--tag-bg': cor }}>
      <Icon name={icone} size={14} />
      {categoria.nome}
    </span>
  )
}
