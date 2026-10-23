import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import Accordion from './Accordion'
import Button from './Button'
import CategoryTag from './CategoryTag'
import { EmptyState, ErrorMessage, Loading } from './Feedback'
import StatusBadge from './StatusBadge'

describe('Accordion', () => {
  const itens = [
    { id: 'a', titulo: 'Módulos', conteudo: 'Conteúdo A' },
    { id: 'b', titulo: 'Dúvidas frequentes', conteudo: 'Conteúdo B' },
  ]

  it('começa com todos os itens fechados', () => {
    render(<Accordion items={itens} />)
    for (const botao of screen.getAllByRole('button')) expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Conteúdo A')).not.toBeVisible()
  })

  it('abre e fecha ao clicar, anunciando o estado em aria-expanded', async () => {
    const usuario = userEvent.setup()
    render(<Accordion items={itens} />)
    const botao = screen.getByRole('button', { name: 'Módulos' })

    await usuario.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Conteúdo A')).toBeVisible()

    await usuario.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Conteúdo A')).not.toBeVisible()
  })

  it('os itens são independentes: abrir um não fecha o outro', async () => {
    const usuario = userEvent.setup()
    render(<Accordion items={itens} />)
    await usuario.click(screen.getByRole('button', { name: 'Módulos' }))
    await usuario.click(screen.getByRole('button', { name: 'Dúvidas frequentes' }))

    expect(screen.getByText('Conteúdo A')).toBeVisible()
    expect(screen.getByText('Conteúdo B')).toBeVisible()
  })

  it('liga cada botão ao seu painel (aria-controls / aria-labelledby)', () => {
    render(<Accordion items={itens} />)
    const botao = screen.getByRole('button', { name: 'Módulos' })
    const painel = document.getElementById(botao.getAttribute('aria-controls'))
    expect(painel).toHaveAttribute('role', 'region')
    expect(painel).toHaveAttribute('aria-labelledby', botao.id)
  })

  it('funciona pelo teclado (Enter e espaço)', async () => {
    const usuario = userEvent.setup()
    render(<Accordion items={itens} />)
    const botao = screen.getByRole('button', { name: 'Módulos' })
    botao.focus()
    await usuario.keyboard('{Enter}')
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    await usuario.keyboard(' ')
    expect(botao).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Button', () => {
  it('sem destino renderiza um <button> que dispara o clique', async () => {
    const aoClicar = vi.fn()
    render(<Button onClick={aoClicar}>Salvar</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(aoClicar).toHaveBeenCalledTimes(1)
  })

  it('com "to" renderiza um link interno do React Router', () => {
    render(
      <MemoryRouter>
        <Button to="/cursos">Ver cursos</Button>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Ver cursos' })).toHaveAttribute('href', '/cursos')
  })

  it('com "href" renderiza um link comum (ex.: mailto)', () => {
    render(<Button href="mailto:contato@exemplo.com">Escrever</Button>)
    expect(screen.getByRole('link', { name: 'Escrever' })).toHaveAttribute('href', 'mailto:contato@exemplo.com')
  })

  it('aplica a variante como classe', () => {
    render(<Button variant="dark">Escuro</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn--dark')
  })

  it('o ícone de seta é decorativo e não entra no nome acessível', () => {
    render(<Button arrow>Matricule-se</Button>)
    expect(screen.getByRole('button', { name: 'Matricule-se' })).toBeInTheDocument()
  })
})

describe('StatusBadge', () => {
  it.each([
    ['Disponivel', 'Disponível'],
    ['EmBreve', 'Em breve'],
    ['Encerrado', 'Encerrado'],
  ])('mostra o rótulo e a classe do status %s', (valor, rotulo) => {
    render(<StatusBadge status={{ valor, rotulo }} />)
    const selo = screen.getByText(rotulo)
    expect(selo).toHaveClass(`status--${valor.toLowerCase()}`)
  })
})

describe('CategoryTag', () => {
  it('mostra o nome da categoria e usa a cor dela', () => {
    render(<CategoryTag categoria={{ slug: 'matematica', nome: 'Matemática' }} />)
    const etiqueta = screen.getByText('Matemática')
    expect(etiqueta.style.getPropertyValue('--tag-bg')).toContain('--color-tag-matematica')
  })

  it('não quebra com uma categoria desconhecida', () => {
    render(<CategoryTag categoria={{ slug: 'outra', nome: 'Outra' }} />)
    expect(screen.getByText('Outra')).toBeInTheDocument()
  })
})

describe('Feedback', () => {
  it('Loading é anunciado como status para leitores de tela', () => {
    render(<Loading message="Carregando cursos..." />)
    expect(screen.getByRole('status')).toHaveTextContent('Carregando cursos...')
  })

  it('ErrorMessage é um alerta com o texto do erro e botão de tentar novamente', async () => {
    const tentar = vi.fn()
    render(<ErrorMessage error={new Error('Servidor fora do ar')} onRetry={tentar} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Servidor fora do ar')
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(tentar).toHaveBeenCalledTimes(1)
  })

  it('ErrorMessage sem onRetry não mostra o botão e tem mensagem padrão', () => {
    render(<ErrorMessage error={null} />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByRole('alert')).toHaveTextContent('Ocorreu um erro inesperado.')
  })

  it('o nível do título é configurável (h1 quando ocupa a página toda)', () => {
    render(<ErrorMessage error={new Error('x')} nivel={1} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('EmptyState mostra título, texto e a ação', () => {
    render(
      <EmptyState title="Nenhum curso encontrado" action={<button type="button">Limpar</button>}>
        Tente outro nome.
      </EmptyState>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Nenhum curso encontrado' })).toBeInTheDocument()
    expect(screen.getByText('Tente outro nome.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument()
  })
})
