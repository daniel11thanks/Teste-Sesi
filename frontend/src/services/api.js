const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { params, signal } = {}) {
  const query = new URLSearchParams()
  for (const [chave, valor] of Object.entries(params ?? {})) {
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
      query.set(chave, String(valor).trim())
    }
  }
  const url = `${BASE_URL}${path}${query.size ? `?${query}` : ''}`

  let resposta
  try {
    resposta = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.')
  }

  if (!resposta.ok) {
    let mensagem = 'Ocorreu um erro ao consultar os cursos.'
    if (resposta.status === 404) mensagem = 'O conteúdo solicitado não foi encontrado.'
    else if (resposta.status >= 500) mensagem = 'O servidor está indisponível no momento. Tente novamente em instantes.'
    else {
      try {
        const corpo = await resposta.json()
        if (corpo?.erro) mensagem = corpo.erro
      } catch {
        /* mantém a mensagem padrão */
      }
    }
    throw new ApiError(mensagem, resposta.status)
  }

  return resposta.json()
}

export const listarCursos = (filtros, signal) => request('/api/cursos', { params: filtros, signal })
export const obterCurso = (id, signal) => request(`/api/cursos/${id}`, { signal })
export const obterFiltros = (signal) => request('/api/filtros', { signal })
