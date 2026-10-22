import './Feedback.css'

/** Estado de carregamento anunciado para leitores de tela. */
export function Loading({ message = 'Carregando...' }) {
  return (
    <div className="feedback" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

/** Mensagem de erro com ação para tentar novamente. */
export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="feedback feedback--error" role="alert">
      <h2 className="feedback__title">Não foi possível carregar</h2>
      <p>{error?.message ?? 'Ocorreu um erro inesperado.'}</p>
      {onRetry && (
        <button type="button" className="feedback__button" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}

/** Estado vazio (nenhum resultado). */
export function EmptyState({ title, children, action }) {
  return (
    <div className="feedback" role="status" aria-live="polite">
      <h2 className="feedback__title">{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
