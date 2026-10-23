import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, listarCursos, obterCurso, obterFiltros } from './api'

function resposta(corpo, { status = 200, json } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: json ?? (async () => corpo),
  }
}

const simular = (impl) => vi.spyOn(globalThis, 'fetch').mockImplementation(impl)

afterEach(() => vi.restoreAllMocks())

describe('montagem da URL', () => {
  it('envia só os filtros preenchidos, sem espaços nas pontas', async () => {
    const f = simular(async () => resposta({ total: 0, cursos: [] }))
    await listarCursos({ busca: '  quimica ', categoria: '', modalidade: 'EAD', status: undefined })
    expect(f.mock.calls[0][0]).toBe('/api/cursos?busca=quimica&modalidade=EAD')
  })

  it('não acrescenta "?" quando não há filtros', async () => {
    const f = simular(async () => resposta({}))
    await listarCursos({ busca: '   ', categoria: '' })
    expect(f.mock.calls[0][0]).toBe('/api/cursos')
  })

  it('codifica caracteres especiais da busca', async () => {
    const f = simular(async () => resposta({}))
    await listarCursos({ busca: 'a&b=c ç' })
    expect(f.mock.calls[0][0]).toBe('/api/cursos?busca=a%26b%3Dc+%C3%A7')
  })

  it('pede o detalhe e os filtros nas rotas certas', async () => {
    const f = simular(async () => resposta({}))
    await obterCurso(7)
    await obterFiltros()
    expect(f.mock.calls.map((c) => c[0])).toEqual(['/api/cursos/7', '/api/filtros'])
  })

  it('pede JSON e repassa o signal de cancelamento', async () => {
    const f = simular(async () => resposta({}))
    const controle = new AbortController()
    await obterFiltros(controle.signal)
    expect(f.mock.calls[0][1].headers.Accept).toBe('application/json')
    expect(f.mock.calls[0][1].signal).toBe(controle.signal)
  })
})

describe('resposta de sucesso', () => {
  it('devolve o JSON da API', async () => {
    simular(async () => resposta({ total: 2, cursos: [{ id: 1 }, { id: 2 }] }))
    await expect(listarCursos({})).resolves.toEqual({ total: 2, cursos: [{ id: 1 }, { id: 2 }] })
  })

  it('falha com ApiError se o corpo não for JSON', async () => {
    simular(async () =>
      resposta(null, {
        json: async () => {
          throw new SyntaxError('inválido')
        },
      }),
    )
    await expect(obterFiltros()).rejects.toMatchObject({ name: 'ApiError', message: expect.stringMatching(/não pôde ser lida/) })
  })
})

describe('erros', () => {
  it('404 vira "não encontrado" e guarda o status', async () => {
    simular(async () => resposta({}, { status: 404 }))
    const erro = await obterCurso(999).catch((e) => e)
    expect(erro).toBeInstanceOf(ApiError)
    expect(erro.status).toBe(404)
    expect(erro.message).toMatch(/não foi encontrado/)
  })

  it('5xx vira "servidor indisponível"', async () => {
    simular(async () => resposta({}, { status: 503 }))
    const erro = await listarCursos({}).catch((e) => e)
    expect(erro.status).toBe(503)
    expect(erro.message).toMatch(/indisponível/)
  })

  it('400 usa a mensagem enviada pela API', async () => {
    simular(async () => resposta({ erro: 'Categoria inválida.' }, { status: 400 }))
    const erro = await listarCursos({ categoria: 'x' }).catch((e) => e)
    expect(erro.status).toBe(400)
    expect(erro.message).toBe('Categoria inválida.')
  })

  it('400 sem corpo legível mantém a mensagem padrão', async () => {
    simular(async () =>
      resposta(null, {
        status: 400,
        json: async () => {
          throw new Error('vazio')
        },
      }),
    )
    const erro = await listarCursos({}).catch((e) => e)
    expect(erro.message).toMatch(/Ocorreu um erro/)
  })

  it('falha de rede vira ApiError com status 0', async () => {
    simular(async () => {
      throw new TypeError('Failed to fetch')
    })
    const erro = await listarCursos({}).catch((e) => e)
    expect(erro).toBeInstanceOf(ApiError)
    expect(erro.status).toBe(0)
    expect(erro.message).toMatch(/conectar ao servidor/)
  })

  it('cancelamento (AbortError) é repassado como está, para a tela ignorar', async () => {
    simular(async () => {
      throw new DOMException('abortado', 'AbortError')
    })
    const erro = await obterFiltros().catch((e) => e)
    expect(erro).not.toBeInstanceOf(ApiError)
    expect(erro.name).toBe('AbortError')
  })
})
