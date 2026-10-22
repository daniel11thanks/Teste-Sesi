import { DEPOIMENTOS } from '../../data/depoimentos'
import Carousel from '../ui/Carousel'
import Icon from '../ui/Icon'
import './Testimonials.css'

/**
 * Seção "Quem fez recomenda".
 * variant: 'dark' (Landing: fundo vinho, cards vermelhos) | 'light' (Detalhes: fundo pêssego, cards brancos).
 */
export default function Testimonials({ variant = 'dark' }) {
  return (
    <section className={`testimonials testimonials--${variant}`} aria-labelledby="titulo-depoimentos">
      <div className="container testimonials__header">
        <p className="testimonials__label">Depoimentos</p>
        <h2 id="titulo-depoimentos" className="testimonials__title">
          Quem fez recomenda
        </h2>
      </div>

      <Carousel label="Depoimentos de alunos" variant={variant === 'dark' ? 'dark' : 'light'}>
        {DEPOIMENTOS.map((d) => (
          <li key={d.id} className="testimonial">
            <figure className="testimonial__figure">
              <blockquote className="testimonial__quote">
                <p>“{d.texto}”</p>
              </blockquote>
              <figcaption className="testimonial__author">
                <strong>{d.nome}</strong>
                <span>{d.cargo}</span>
                <span className="testimonial__stars" role="img" aria-label="Avaliação: 5 de 5 estrelas">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" size={16} />
                  ))}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </Carousel>
    </section>
  )
}
