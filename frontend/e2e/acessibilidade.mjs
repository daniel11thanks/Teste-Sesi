import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

// Auditoria automática de acessibilidade (axe-core, regras WCAG 2.0/2.1/2.2 A e AA + boas práticas) em todas as telas,
// em desktop (1440 px) e celular (390 px). Pré-requisitos: API (porta 5080) e `npm run dev` rodando, banco com o seed.
// Variáveis: BASE_URL e CHROME_PATH. Uso: npm run test:a11y
const axeSrc = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })

const cenarios = [
  ['Landing', '/', null],
  ['Catálogo', '/cursos', null],
  ['Catálogo vazio', '/cursos?busca=zzzz', null],
  ['Catálogo filtrado', '/cursos?categoria=matematica&status=Disponivel', null],
  ['Detalhe (acordeões abertos)', '/cursos/1', async (page) => {
    for (let n = 1; n <= 3; n++) {
      await page.$eval(`.accordion__item:nth-child(${n}) .accordion__button`, (e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await page.click(`.accordion__item:nth-child(${n}) .accordion__button`)
    }
  }],
  ['Detalhe em breve', '/cursos/3', null],
  ['Curso inexistente', '/cursos/999', null],
  ['AVA', '/ava/1', null],
  ['404', '/pagina-que-nao-existe', null],
]

let total = 0
for (const largura of [1440, 390]) {
  for (const [nome, caminho, preparar] of cenarios) {
    const page = await browser.newPage()
    await page.setViewport({ width: largura, height: 900 })
    await page.goto(`${BASE}${caminho}`)
    await page.waitForSelector('main', { timeout: 8000 })
    await new Promise((r) => setTimeout(r, 900))
    if (preparar) await preparar(page)
    if (nome === 'AVA' && largura === 390) await page.click('.ava__toggle')
    await page.evaluate(axeSrc)
    const r = await page.evaluate(() =>
      window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }),
    )
    const v = r.violations
    total += v.length
    console.log(`${v.length === 0 ? 'OK  ' : 'ERRO'} ${String(largura).padStart(4)}px  ${nome}  (${r.passes.length} regras ok${v.length ? `, ${v.length} violações` : ''})`)
    for (const x of v) {
      console.log(`      [${x.impact}] ${x.id}: ${x.help}`)
      for (const n of x.nodes.slice(0, 3)) console.log(`         ${n.target.join(' ')}  ${(n.failureSummary || '').split('\n')[1] ?? ''}`)
    }
    await page.close()
  }
}
console.log(total === 0 ? '\nNenhuma violação encontrada pelo axe.' : `\n${total} violação(ões) no total.`)
await browser.close()
