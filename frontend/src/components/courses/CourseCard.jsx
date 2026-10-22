import { Link } from 'react-router-dom'
import CategoryTag from '../ui/CategoryTag'
import './CourseCard.css'

/** Card de curso da Landing: foto com degradê para o vermelho, etiqueta de categoria, título e descrição. */
export default function CourseCard({ curso }) {
  return (
    <li className="course-card">
      <Link to={`/cursos/${curso.id}`} className="course-card__link">
        <img className="course-card__image" src={curso.imagemUrl} alt="" loading="lazy" />
        <div className="course-card__tag">
          <CategoryTag categoria={curso.categoria} />
        </div>
        <div className="course-card__body">
          <h3 className="course-card__title">{curso.nomeCompleto}</h3>
          <p className="course-card__text">{curso.descricao}</p>
        </div>
      </Link>
    </li>
  )
}

/** Último card do carrossel: leva ao catálogo completo. */
export function AllCoursesCard() {
  return (
    <li className="course-card course-card--all">
      <Link to="/cursos" className="course-card__link">
        <span className="course-card__all-title">Todos os cursos</span>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      </Link>
    </li>
  )
}
