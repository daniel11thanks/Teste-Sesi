import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDocumentTitle } from './useDocumentTitle'
import { useAsync } from './useAsync'

describe('useAsync', () => {
  it('começa carregando e entrega os dados quando a promessa resolve', async () => {
    const carregar = vi.fn().mockResolvedValue({ total: 3 })
    const { result } = renderHook(() => useAsync(carregar, []))

    expect(result.current).toMatchObject({ loading: true, data: null, error: null })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current).toMatchObject({ data: { total: 3 }, error: null })
  })

  it('expõe o erro quando a promessa rejeita', async () => {
    const erro = new Error('falhou')
    const { result } = renderHook(() => useAsync(() => Promise.reject(erro), []))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe(erro)
    expect(result.current.data).toBeNull()
  })

  it('refaz a chamada quando as dependências mudam e mantém os dados antigos enquanto carrega (sem piscar)', async () => {
    let liberar
    const carregar = vi
      .fn()
      .mockResolvedValueOnce('primeiro')
      .mockImplementationOnce(() => new Promise((resolve) => (liberar = resolve)))
    const { result, rerender } = renderHook(({ dep }) => useAsync(carregar, [dep]), { initialProps: { dep: 1 } })
    await waitFor(() => expect(result.current.data).toBe('primeiro'))

    rerender({ dep: 2 })
    await waitFor(() => expect(result.current.loading).toBe(true))
    expect(result.current.data).toBe('primeiro')

    await act(async () => liberar('segundo'))
    await waitFor(() => expect(result.current.data).toBe('segundo'))
    expect(carregar).toHaveBeenCalledTimes(2)
  })

  it('cancela a requisição anterior ao mudar as dependências', async () => {
    const sinais = []
    const carregar = (signal) => {
      sinais.push(signal)
      return new Promise(() => {})
    }
    const { rerender } = renderHook(({ dep }) => useAsync(carregar, [dep]), { initialProps: { dep: 1 } })
    rerender({ dep: 2 })

    expect(sinais).toHaveLength(2)
    expect(sinais[0].aborted).toBe(true)
    expect(sinais[1].aborted).toBe(false)
  })

  it('ignora o erro de cancelamento (AbortError) em vez de mostrá-lo', async () => {
    const abortado = new DOMException('cancelado', 'AbortError')
    const carregar = vi.fn().mockRejectedValue(abortado)
    const { result } = renderHook(() => useAsync(carregar, []))

    await waitFor(() => expect(carregar).toHaveBeenCalled())
    await act(async () => {})
    expect(result.current.error).toBeNull()
  })

  it('reload tenta de novo depois de um erro', async () => {
    const carregar = vi.fn().mockRejectedValueOnce(new Error('instável')).mockResolvedValueOnce('ok')
    const { result } = renderHook(() => useAsync(carregar, []))
    await waitFor(() => expect(result.current.error).not.toBeNull())

    act(() => result.current.reload())
    await waitFor(() => expect(result.current.data).toBe('ok'))
    expect(result.current.error).toBeNull()
    expect(carregar).toHaveBeenCalledTimes(2)
  })
})

describe('useDocumentTitle', () => {
  it('monta o título da aba com o nome do site', () => {
    renderHook(() => useDocumentTitle('Catálogo de cursos'))
    expect(document.title).toBe('Catálogo de cursos | SESI Indústria')
  })

  it('usa o título padrão quando não recebe nome', () => {
    renderHook(() => useDocumentTitle(undefined))
    expect(document.title).toBe('SESI Indústria | Catálogo de cursos')
  })

  it('atualiza o título quando o nome muda', () => {
    const { rerender } = renderHook(({ t }) => useDocumentTitle(t), { initialProps: { t: 'Curso A' } })
    expect(document.title).toBe('Curso A | SESI Indústria')
    rerender({ t: 'Curso B' })
    expect(document.title).toBe('Curso B | SESI Indústria')
  })
})
