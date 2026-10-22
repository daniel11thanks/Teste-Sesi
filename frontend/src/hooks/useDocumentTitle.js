import { useEffect } from 'react'

const SUFIXO = 'SESI Indústria'

/** Atualiza o título da aba (útil para leitores de tela e para o histórico do navegador). */
export function useDocumentTitle(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | ${SUFIXO}` : `${SUFIXO} | Catálogo de cursos`
  }, [titulo])
}
