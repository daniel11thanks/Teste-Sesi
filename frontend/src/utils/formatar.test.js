import { describe, expect, it } from 'vitest'
import { formatarCargaHoraria, formatarData, normalizar, rotuloQuantidade } from './formatar'

describe('formatarData', () => {
  it('converte AAAA-MM-DD em DD/MM/AAAA', () => {
    expect(formatarData('2026-01-05')).toBe('05/01/2026')
    expect(formatarData('2027-12-31')).toBe('31/12/2027')
  })

  it('mantém o dia exato na virada do mês (não passa por Date, então não sofre deslocamento de fuso)', () => {
    expect(formatarData('2026-03-01')).toBe('01/03/2026')
    expect(formatarData('2026-01-01')).toBe('01/01/2026')
  })

  it('devolve null quando o curso não tem data', () => {
    expect(formatarData(null)).toBeNull()
    expect(formatarData(undefined)).toBeNull()
    expect(formatarData('')).toBeNull()
  })
})

describe('formatarCargaHoraria', () => {
  it('acrescenta a unidade', () => {
    expect(formatarCargaHoraria(40)).toBe('40 h')
    expect(formatarCargaHoraria(120)).toBe('120 h')
  })
})

describe('rotuloQuantidade', () => {
  it('usa o singular só para 1', () => {
    expect(rotuloQuantidade(1)).toBe('1 curso encontrado')
  })

  it('usa o plural para 0 e para mais de 1', () => {
    expect(rotuloQuantidade(0)).toBe('0 cursos encontrados')
    expect(rotuloQuantidade(8)).toBe('8 cursos encontrados')
  })
})

describe('normalizar', () => {
  it('remove acentos e cedilha', () => {
    expect(normalizar('Matemática para a Precisão')).toBe('matematica para a precisao')
    expect(normalizar('Sustentabilidade e Ação')).toBe('sustentabilidade e acao')
  })

  it('ignora maiúsculas e espaços nas pontas', () => {
    expect(normalizar('  QUÍMICA  ')).toBe('quimica')
  })

  it('mantém o texto sem acento como está', () => {
    expect(normalizar('modulo 3')).toBe('modulo 3')
  })

  it('devolve vazio para texto vazio', () => {
    expect(normalizar('')).toBe('')
    expect(normalizar('   ')).toBe('')
  })
})
