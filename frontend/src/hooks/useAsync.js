import { useCallback, useEffect, useState } from 'react'

/**
 * Executa `carregar(signal)` quando `deps` mudam e expõe { data, loading, error, reload }.
 * A requisição anterior é cancelada ao mudar as dependências; `data` anterior é mantida
 * enquanto a nova carrega, para a tela não "piscar".
 */
export function useAsync(carregar, deps) {
  const [estado, setEstado] = useState({ data: null, loading: true, error: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    setEstado((atual) => ({ ...atual, loading: true, error: null }))

    carregar(controle.signal)
      .then((data) => setEstado({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setEstado((atual) => ({ ...atual, loading: false, error }))
      })

    return () => controle.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tentativa])

  const reload = useCallback(() => setTentativa((n) => n + 1), [])

  return { ...estado, reload }
}
