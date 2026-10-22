import { useId, useState } from 'react'
import Icon from './Icon'
import './Accordion.css'

/**
 * Acordeão em que cada item abre e fecha de forma independente (como no Figma).
 * items: [{ id, titulo, conteudo }]. Todos começam fechados.
 */
export default function Accordion({ items }) {
  const base = useId()
  const [abertos, setAbertos] = useState(() => new Set())

  const alternar = (id) =>
    setAbertos((atual) => {
      const proximo = new Set(atual)
      if (proximo.has(id)) proximo.delete(id)
      else proximo.add(id)
      return proximo
    })

  return (
    <div className="accordion">
      {items.map(({ id, titulo, conteudo }) => {
        const aberto = abertos.has(id)
        const idPainel = `${base}-painel-${id}`
        const idBotao = `${base}-botao-${id}`
        return (
          <div key={id} className="accordion__item">
            <h3 className="accordion__heading">
              <button
                type="button"
                id={idBotao}
                className="accordion__button"
                aria-expanded={aberto}
                aria-controls={idPainel}
                onClick={() => alternar(id)}
              >
                <span>{titulo}</span>
                <Icon name={aberto ? 'remove' : 'add_2'} size={24} />
              </button>
            </h3>
            <div id={idPainel} role="region" aria-labelledby={idBotao} hidden={!aberto} className="accordion__panel">
              {conteudo}
            </div>
          </div>
        )
      })}
    </div>
  )
}
