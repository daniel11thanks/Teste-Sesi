import { describe, expect, it } from 'vitest'
import { estiloCategoria } from './categorias'

const SLUGS = ['matematica', 'ciencias-da-natureza', 'linguagens', 'sustentabilidade']

describe('estiloCategoria', () => {
  it.each([
    ['matematica', 'icon-matematica-20px'],
    ['ciencias-da-natureza', 'icon-ciencias-natureza-20px'],
    ['linguagens', 'icon-linguagens-20px'],
    ['sustentabilidade', 'icon-sustentabilidade-20px'],
  ])('a categoria %s tem o seu ícone', (slug, icone) => {
    expect(estiloCategoria(slug).icone).toBe(icone)
  })

  it('cada categoria conhecida usa uma cor diferente', () => {
    const cores = SLUGS.map((s) => estiloCategoria(s).cor)
    expect(new Set(cores).size).toBe(SLUGS.length)
  })

  it('uma categoria desconhecida cai no estilo padrão em vez de quebrar', () => {
    const padrao = estiloCategoria('nao-existe')
    expect(padrao.icone).toBeTruthy()
    expect(padrao.cor).toBeTruthy()
    expect(estiloCategoria(undefined)).toEqual(padrao)
  })
})
