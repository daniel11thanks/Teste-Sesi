import { Link } from 'react-router-dom'
import { formatarCargaHoraria, formatarData } from '../../utils/formatar'
import CategoryTag from '../ui/CategoryTag'
import { CalendarGlyph, ClockGlyph, ModeGlyph, UsersGlyph } from '../ui/Glyphs'
import StatusBadge from '../ui/StatusBadge'
import './CourseListCard.css'

/** Card do catálogo: mostra todos os campos do curso (carga horária, modalidade, público-alvo, status e data). */
export default function CourseListCard({ curso }) {
  const data = formatarData(curso.dataDisponibilizacao)

  return (
    <li className="list-card">
      <Link to={`/cursos/${curso.id}`} className="list-card__link" aria-labelledby={`curso-${curso.id}`}>
        <img className="list-card__image" src={curso.imagemUrl} alt="" loading="lazy" />

        <div className="list-card__body">
          <div className="list-card__top">
            <CategoryTag categoria={curso.categoria} />
            <StatusBadge status={curso.status} />
          </div>

          <h2 id={`curso-${curso.id}`} className="list-card__title">
            {curso.nomeCompleto}
          </h2>
          <p className="list-card__text">{curso.descricao}</p>

          <ul className="list-card__meta">
            <li>
              <ClockGlyph />
              <span>
                <span className="sr-only">Carga horária: </span>
                {formatarCargaHoraria(curso.cargaHoraria)}
              </span>
            </li>
            <li>
              <ModeGlyph />
              <span>
                <span className="sr-only">Modalidade: </span>
                {curso.modalidade.rotulo}
              </span>
            </li>
            {data && (
              <li>
                <CalendarGlyph />
                <span>Início: {data}</span>
              </li>
            )}
            <li className="list-card__audience">
              <UsersGlyph />
              <span>
                <span className="list-card__audience-label">Público-alvo:</span> {curso.publicoAlvo}
              </span>
            </li>
          </ul>
        </div>
      </Link>
    </li>
  )
}
