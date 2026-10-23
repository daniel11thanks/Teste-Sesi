import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { listarCursos, obterFiltros } from '../services/api'
import Catalogo from './Catalogo'

vi.mock('../services/api', () => ({
  listarCursos: vi.fn(),
  obterFiltros: vi.fn(),
}))

const curso = (id, nome) => ({
  id,
  nomeCompleto: nome,
  nomeBreve: nome,
  descricao: `Descrição de ${nome}`,
  imagemUrl: `/cursos/${id}.webp`,
  cargaHoraria: 40,
  publicoAlvo: 'Estudantes',
  dataDisponibilizacao: '2026-01-05',
  categoria: { slug: 'matematica', nome: 'Matemática' },
  modalidade: { valor: 'EAD', rotulo: 'EAD' },
  status: { valor: 'Disponivel', rotulo: 'Disponível' },
})

const FILTROS = {
  categorias: [
    { slug: 'matematica', nome: 'Matemática' },
    { slug: 'linguagens', nome: 'Linguagens' },
  ],
  modalidades: [{ valor: 'EAD', rotulo: 'EAD' }],
  status: [{ valor: 'Disponivel', rotulo: 'Disponível' }],
}

// Mostra a URL atual, para conferir o que a página gravou nos parâmetros de busca.
function Url() {
  const { search } = useLocation()
  return <output data-testid="url">{search}</output>
}

const abrir = (url = '/cursos') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Catalogo />
      <Url />
    </MemoryRouter>,
  )

const url = () => new URLSearchParams(screen.getByTestId('url').textContent)

beforeEach(() => {
  vi.mocked(obterFiltros).mockResolvedValue(FILTROS)
  vi.mocked(listarCursos).mockResolvedValue({ total: 2, itens: [curso(1, 'Matemática Básica'), curso(2, 'Geometria')] })
})

describe('Catálogo', () => {
  it('lista os cursos devolvidos pela API e anuncia a quantidade', async () => {
    abrir()
    expect(await screen.findByRole('link', { name: 'Matemática Básica' })).toHaveAttribute('href', '/cursos/1')
    expect(screen.getByRole('link', { name: 'Geometria' })).toBeInTheDocument()
    expect(await screen.findByText('2 cursos encontrados')).toBeInTheDocument()
  })

  it('lê os filtros da URL e os envia à API', async () => {
    abrir('/cursos?busca=quimica&categoria=matematica')
    await waitFor(() =>
      expect(listarCursos).toHaveBeenCalledWith(
        { busca: 'quimica', categoria: 'matematica', modalidade: '', status: '' },
        expect.anything(),
      ),
    )
    expect(screen.getByLabelText('Pesquisar pelo nome do curso')).toHaveValue('quimica')
  })

  it('a busca só vai para a URL e para a API depois de uma pausa na digitação', async () => {
    const usuario = userEvent.setup()
    abrir()
    await screen.findByText('2 cursos encontrados')
    vi.mocked(listarCursos).mockClear()

    await usuario.type(screen.getByLabelText('Pesquisar pelo nome do curso'), 'geo')
    expect(listarCursos).not.toHaveBeenCalled() // ainda digitando: nada de requisição a cada tecla

    await waitFor(() => expect(url().get('busca')).toBe('geo'))
    await waitFor(() => expect(listarCursos).toHaveBeenCalledTimes(1))
    expect(vi.mocked(listarCursos).mock.calls[0][0].busca).toBe('geo')
  })

  it('escolher um filtro grava na URL imediatamente', async () => {
    const usuario = userEvent.setup()
    abrir()
    await screen.findByText('2 cursos encontrados')
    await screen.findByRole('option', { name: 'Linguagens' })

    await usuario.selectOptions(screen.getByLabelText('Categoria'), 'linguagens')
    expect(url().get('categoria')).toBe('linguagens')
  })

  it('REGRESSÃO: a busca atrasada não apaga o filtro escolhido enquanto ela esperava', async () => {
    const usuario = userEvent.setup()
    abrir()
    await screen.findByText('2 cursos encontrados')
    await screen.findByRole('option', { name: 'Linguagens' })

    await usuario.type(screen.getByLabelText('Pesquisar pelo nome do curso'), 'geo')
    await usuario.selectOptions(screen.getByLabelText('Categoria'), 'linguagens') // antes de a pausa terminar

    await waitFor(() => expect(url().get('busca')).toBe('geo'))
    expect(url().get('categoria')).toBe('linguagens') // o bug antigo apagava este filtro
  })

  it('"Limpar filtros" está desabilitado sem filtros e zera tudo quando há', async () => {
    const usuario = userEvent.setup()
    abrir('/cursos?busca=geo&categoria=matematica')
    const limpar = screen.getByRole('button', { name: 'Limpar filtros' })
    expect(limpar).toBeEnabled()

    await usuario.click(limpar)
    await waitFor(() => expect(screen.getByTestId('url').textContent).toBe(''))
    expect(screen.getByLabelText('Pesquisar pelo nome do curso')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Limpar filtros' })).toBeDisabled()
  })

  it('sem resultados mostra a mensagem e oferece limpar os filtros', async () => {
    vi.mocked(listarCursos).mockResolvedValue({ total: 0, itens: [] })
    abrir('/cursos?busca=zzzz')
    expect(await screen.findByRole('heading', { name: 'Nenhum curso encontrado' })).toBeInTheDocument()
    expect(screen.getByText('0 cursos encontrados')).toBeInTheDocument()
  })

  it('usa o singular quando há um único curso', async () => {
    vi.mocked(listarCursos).mockResolvedValue({ total: 1, itens: [curso(1, 'Matemática Básica')] })
    abrir()
    expect(await screen.findByText('1 curso encontrado')).toBeInTheDocument()
  })

  it('em caso de erro mostra o alerta e "Tentar novamente" refaz a consulta', async () => {
    const usuario = userEvent.setup()
    vi.mocked(listarCursos).mockRejectedValueOnce(new Error('Servidor indisponível'))
    abrir()
    expect(await screen.findByRole('alert')).toHaveTextContent('Servidor indisponível')

    await usuario.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByRole('link', { name: 'Matemática Básica' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('define o título da aba', async () => {
    abrir()
    await screen.findByText('2 cursos encontrados')
    expect(document.title).toBe('Catálogo de cursos | SESI Indústria')
  })
})
