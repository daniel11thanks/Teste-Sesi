import './StatusBadge.css'

/** Selo de status do curso (Disponível, Em breve, Encerrado). */
export default function StatusBadge({ status }) {
  return (
    <span className={`status status--${status.valor.toLowerCase()}`}>
      <span className="status__dot" aria-hidden="true" />
      {status.rotulo}
    </span>
  )
}
