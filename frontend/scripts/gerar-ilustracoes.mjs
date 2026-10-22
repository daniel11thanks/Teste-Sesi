// Gera as ilustrações SVG de apresentação dos cursos em public/cursos/.
// As fotos dos cards do Figma não foram fornecidas; estas ilustrações abstratas as substituem.
// Uso: node scripts/gerar-ilustracoes.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const saida = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'cursos')
mkdirSync(saida, { recursive: true })

const W = 600
const H = 420

const moldura = (id, de, para, motivo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${de}"/>
      <stop offset="1" stop-color="${para}"/>
    </linearGradient>
    <radialGradient id="${id}-luz" cx="0.78" cy="0.2" r="0.6">
      <stop offset="0" stop-color="#fff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-luz)"/>
  ${motivo}
</svg>
`

const branco = (o) => `fill="#fff" fill-opacity="${o}"`
const traco = (o, w = 6) => `fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`

// 1. Geometria: tesselação de triângulos.
function geometria() {
  let s = ''
  const t = 70
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 11; x++) {
      const ox = x * t - (y % 2 ? t / 2 : 0)
      const oy = y * t * 0.9 - 20
      const o = ((x + y) % 3) * 0.12 + 0.06
      s += `<polygon points="${ox},${oy + t} ${ox + t / 2},${oy} ${ox + t},${oy + t}" ${branco(o)}/>`
    }
  }
  s += `<circle cx="430" cy="150" r="78" ${traco(0.7)}/><path d="M352 150h156M430 72v156" ${traco(0.45, 4)}/>`
  return s
}

// 2. Estatística: barras, linha e curva normal.
function estatistica() {
  const barras = [90, 150, 210, 270, 190, 120, 70]
  let s = ''
  barras.forEach((h, i) => {
    s += `<rect x="${70 + i * 66}" y="${360 - h}" width="42" height="${h}" rx="6" ${branco(0.3 + (i === 3 ? 0.35 : 0))}/>`
  })
  s += `<path d="M70 300 C150 250 200 270 260 190 S 380 120 520 90" ${traco(0.9)}/>`
  for (const [x, y] of [[70, 300], [200, 262], [260, 190], [380, 138], [520, 90]]) {
    s += `<circle cx="${x}" cy="${y}" r="9" fill="#fff"/>`
  }
  s += `<path d="M60 372H550" ${traco(0.5, 3)}/>`
  return s
}

// 3. Física: ondas e arco de movimento.
function fisica() {
  let s = ''
  for (let i = 0; i < 4; i++) {
    const y = 130 + i * 55
    s += `<path d="M0 ${y} C 75 ${y - 50}, 150 ${y + 50}, 225 ${y} S 375 ${y - 50}, 450 ${y} S 560 ${y + 40}, 600 ${y}" ${traco(0.55 - i * 0.1, 5)}/>`
  }
  s += `<circle cx="470" cy="110" r="46" ${branco(0.85)}/>`
  s += `<path d="M120 330 Q 300 60 480 330" ${traco(0.75, 5)} stroke-dasharray="2 14"/>`
  for (const [x, y] of [[150, 300], [215, 205], [300, 170], [385, 205], [450, 300]]) {
    s += `<circle cx="${x}" cy="${y}" r="10" fill="#fff"/>`
  }
  return s
}

// 4. Química: frasco, bolhas e folha.
function quimica() {
  let s = `<path d="M255 70h90v90l75 150a38 38 0 0 1-34 55H214a38 38 0 0 1-34-55l75-150z" ${traco(0.95, 8)}/>`
  s += `<path d="M205 290h190l22 40a22 22 0 0 1-20 32H203a22 22 0 0 1-20-32z" ${branco(0.4)}/>`
  for (const [x, y, r] of [[285, 250, 14], [330, 215, 9], [305, 180, 6], [255, 300, 8], [350, 285, 12]]) {
    s += `<circle cx="${x}" cy="${y}" r="${r}" ${branco(0.9)}/>`
  }
  s += `<path d="M470 120c-70 0-100 50-100 110 60 0 100-40 100-110z" ${branco(0.55)}/><path d="M470 120C440 160 410 190 385 225" ${traco(0.9, 4)}/>`
  return s
}

// 5. Materiais: rede hexagonal (favo).
function materiais() {
  let s = ''
  const r = 46
  const dx = r * Math.sqrt(3)
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      const cx = 30 + col * dx + (row % 2 ? dx / 2 : 0)
      const cy = 40 + row * r * 1.5
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = (Math.PI / 3) * k + Math.PI / 6
        return `${(cx + r * 0.9 * Math.cos(a)).toFixed(1)},${(cy + r * 0.9 * Math.sin(a)).toFixed(1)}`
      }).join(' ')
      const forte = (row * 3 + col) % 5 === 0
      s += `<polygon points="${pts}" fill="${forte ? '#fff' : 'none'}" fill-opacity="${forte ? 0.3 : 0}" stroke="#fff" stroke-opacity="0.55" stroke-width="3"/>`
      s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" fill="#fff" fill-opacity="0.8"/>`
    }
  }
  return s
}

// 6. Comunicação: balões de fala e documento.
function comunicacao() {
  let s = `<rect x="90" y="70" width="270" height="170" rx="22" ${branco(0.9)}/><path d="M140 240l-8 52 58-52z" ${branco(0.9)}/>`
  s += `<path d="M125 115h190M125 150h150M125 185h175" fill="none" stroke="#7a1020" stroke-opacity="0.55" stroke-width="10" stroke-linecap="round"/>`
  s += `<rect x="300" y="190" width="215" height="140" rx="20" ${branco(0.35)}/><path d="M470 330l8 46-52-46z" ${branco(0.35)}/>`
  s += `<path d="M335 235h140M335 270h100" ${traco(0.9, 9)}/>`
  return s
}

// 7. Economia circular: três setas em ciclo.
function circular() {
  const cx = 300
  const cy = 210
  const R = 110
  let s = `<circle cx="${cx}" cy="${cy}" r="${R + 50}" ${branco(0.1)}/>`
  for (let i = 0; i < 3; i++) {
    const a0 = (i * 120 - 90 + 12) * (Math.PI / 180)
    const a1 = (i * 120 - 90 + 108) * (Math.PI / 180)
    const p = (a) => `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy + R * Math.sin(a)).toFixed(1)}`
    s += `<path d="M${p(a0)} A${R} ${R} 0 0 1 ${p(a1)}" ${traco(0.95, 18)}/>`
    const tx = cx + R * Math.cos(a1)
    const ty = cy + R * Math.sin(a1)
    const ang = a1 + Math.PI / 2
    s += `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${((ang * 180) / Math.PI).toFixed(1)})"><polygon points="0,-30 28,18 -28,18" fill="#fff"/></g>`
  }
  return s
}

const ilustracoes = {
  'geometria-textil': ['#f0a03a', '#a3141b', geometria],
  'estatistica-qualidade': ['#2f4a63', '#8a1020', estatistica],
  'fisica-metalurgia': ['#f29a30', '#9a0312', fisica],
  'quimica-sustentabilidade': ['#2f8f7a', '#7d1424', quimica],
  'ciencia-materiais': ['#5d6a78', '#9a0312', materiais],
  'comunicacao-tecnica': ['#4a78bd', '#8a1020', comunicacao],
  'residuos-economia-circular': ['#6aa84f', '#8a1020', circular],
}

for (const [nome, [de, para, motivo]] of Object.entries(ilustracoes)) {
  writeFileSync(join(saida, `${nome}.svg`), moldura(nome, de, para, motivo()))
  console.log('gerado', `${nome}.svg`)
}
