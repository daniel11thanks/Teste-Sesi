// Aparência de cada categoria (ícone e cor da etiqueta), a partir do Figma.
// "Linguagens" e "Sustentabilidade" não tiveram a cor medida no protótipo: valores escolhidos por nós.
const CATEGORIAS = {
  matematica: { icone: 'icon-matematica-20px', cor: 'var(--color-tag-matematica)' },
  'ciencias-da-natureza': { icone: 'icon-ciencias-natureza-20px', cor: 'var(--color-tag-ciencias)' },
  linguagens: { icone: 'icon-linguagens-20px', cor: 'var(--color-tag-linguagens)' },
  sustentabilidade: { icone: 'icon-sustentabilidade-20px', cor: 'var(--color-tag-sustentabilidade)' },
}

const PADRAO = { icone: 'icon-matematica-20px', cor: 'var(--color-line)' }

export const estiloCategoria = (slug) => CATEGORIAS[slug] ?? PADRAO
