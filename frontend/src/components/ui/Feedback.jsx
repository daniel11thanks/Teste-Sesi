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

/** Mensagem de erro com ação para tentar novamente. `nivel` é o nível do título (1 quando ocupa a página toda). */
export function ErrorMessage({ error, onRetry, nivel = 2 }) {
  const Titulo = `h${nivel}`
  return (
    <div className="feedback feedback--error" role="alert">
      <Titulo className="feedback__title">Não foi possível carregar</Titulo>
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
export function EmptyState({ title, children, action, nivel = 2 }) {
  const Titulo = `h${nivel}`
  return (
    <div className="feedback" role="status" aria-live="polite">
      <Titulo className="feedback__title">{title}</Titulo>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
