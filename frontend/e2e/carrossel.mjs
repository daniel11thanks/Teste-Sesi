// Testes do carrossel (Landing): arrasto com o mouse, clique nos cards, setas e snap.
// Pré-requisitos: API (porta 5080) e `npm run dev` rodando, banco com o seed. Variáveis: BASE_URL e CHROME_PATH.
import puppeteer from 'puppeteer-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })

let falhas = 0
const ok = (cond, nome, extra = '') => {
  if (!cond) falhas++
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${nome}${extra ? '  -> ' + extra : ''}`)
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function abrir() {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(`${BASE}/`)
  await page.waitForSelector('.carousel__track li')
  await page.$eval('.featured', (e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await espera(400)
  return page
}

const rolagem = (page, sel) => page.$eval(sel, (t) => Math.round(t.scrollLeft))
const centro = async (page, sel) => {
  const r = await page.$eval(sel, (e) => { const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } })
  return r
}

// o carrossel assenta em um ponto de snap (início de um card) ou no fim da trilha
const assentado = (page, sel) =>
  page.$eval(sel, (t) => {
    const recuo = parseFloat(getComputedStyle(t).paddingLeft)
    const fim = t.scrollWidth - t.clientWidth
    return t.scrollLeft >= fim - 2 || [...t.children].some((li) => Math.abs(li.offsetLeft - recuo - t.scrollLeft) <= 2)
  })

const TRILHA = '.featured .carousel__track'
const CARD2 = `${TRILHA} li:nth-child(2) a`

// ---- 1. arrastar para a esquerda avança o carrossel e NÃO abre o card
let page = await abrir()
ok((await rolagem(page, TRILHA)) === 0, '1. carrossel começa na posição inicial')
let c = await centro(page, CARD2)
await page.mouse.move(c.x, c.y)
await page.mouse.down()
await page.mouse.move(c.x - 150, c.y, { steps: 10 })
const durante = await page.$eval(TRILHA, (t) => ({ classe: t.classList.contains('carousel__track--arrastando'), cursor: getComputedStyle(t).cursor, scroll: Math.round(t.scrollLeft) }))
ok(durante.classe && durante.cursor === 'grabbing' && durante.scroll > 100, '2. durante o arrasto o carrossel acompanha o mouse e o cursor vira "mão fechada"', JSON.stringify(durante))
await page.mouse.move(c.x - 400, c.y, { steps: 10 })
await page.mouse.up()
await espera(900)
ok(new URL(page.url()).pathname === '/', '4. soltar o arrasto sobre um card NÃO abre o curso', new URL(page.url()).pathname)
if (new URL(page.url()).pathname !== '/') {
  console.log('O arrasto abriu um curso; abortando os demais cenários.')
  await browser.close()
  process.exit(1)
}
const apos = await rolagem(page, TRILHA)
ok(apos > 300, '3. depois de soltar, o carrossel avançou', `scrollLeft=${apos}`)
ok(await assentado(page, TRILHA), '5. o carrossel assenta no início de um card (snap volta a valer ao soltar)')
const botoes = await page.$$eval('.featured .carousel__arrow', (b) => b.map((x) => x.disabled))
ok(botoes[0] === false, '6. a seta "Anterior" é habilitada depois do arrasto', JSON.stringify(botoes))

// ---- 2. arrastar de volta para a direita
c = await centro(page, `${TRILHA} li:nth-child(3) a`)
await page.mouse.move(c.x, c.y)
await page.mouse.down()
await page.mouse.move(c.x + 600, c.y, { steps: 15 })
await page.mouse.up()
await espera(900)
ok((await rolagem(page, TRILHA)) < apos, '7. arrastar para a direita volta o carrossel', `${apos} -> ${await rolagem(page, TRILHA)}`)

// ---- 3. o ponteiro pode sair da trilha durante o arrasto
c = await centro(page, CARD2)
const antes = await rolagem(page, TRILHA)
await page.mouse.move(c.x, c.y)
await page.mouse.down()
await page.mouse.move(c.x - 60, c.y - 400, { steps: 10 }) // sobe bem acima da trilha (fora dela)
const aoSair = await rolagem(page, TRILHA)
await page.mouse.move(c.x - 260, c.y - 420, { steps: 10 }) // e continua para a esquerda, ainda fora
const fora = await rolagem(page, TRILHA)
await page.mouse.up()
await espera(900)
ok(fora - aoSair >= 100, '8. o arrasto continua mesmo com o mouse fora da trilha (captura do ponteiro)', `${aoSair} -> ${fora} fora da trilha`)
void antes
await page.close()

// ---- 4. clique simples (sem arrastar) continua abrindo o curso
page = await abrir()
c = await centro(page, CARD2)
await page.mouse.move(c.x, c.y)
await Promise.all([page.waitForFunction(() => location.pathname.startsWith('/cursos/'), { timeout: 5000 }), page.mouse.click(c.x, c.y)])
ok(/^\/cursos\/\d+$/.test(new URL(page.url()).pathname), '9. clique simples no card abre o detalhe do curso', new URL(page.url()).pathname)
await page.close()

// ---- 5. tremida de poucos pixels não impede o clique
page = await abrir()
c = await centro(page, CARD2)
await page.mouse.move(c.x, c.y)
await page.mouse.down()
await page.mouse.move(c.x + 3, c.y + 1, { steps: 2 })
await page.mouse.up()
await page.waitForFunction(() => location.pathname.startsWith('/cursos/'), { timeout: 5000 })
ok(true, '10. movimento de 3 px (tremida da mão) ainda conta como clique e abre o card')
await page.close()

// ---- 5b. arrasto CURTO dentro do mesmo card: o navegador geraria um clique no link; não pode abrir o curso
page = await abrir()
c = await centro(page, CARD2)
await page.mouse.move(c.x, c.y)
await page.mouse.down()
await page.mouse.move(c.x - 40, c.y, { steps: 8 }) // 40 px: bem menos que a largura do card (288 px)
const seguiu = await rolagem(page, TRILHA) // ainda com o botão pressionado: a trilha acompanha o ponteiro
await page.mouse.up()
await espera(900)
ok(new URL(page.url()).pathname === '/', '10b. arrasto curto (40 px) dentro do mesmo card NÃO abre o curso', new URL(page.url()).pathname)
ok(seguiu >= 30, '10c. durante o arrasto curto a trilha acompanha o mouse', `scrollLeft=${seguiu}`)
await page.close()

// ---- 6. cursor de mão sobre os cards e setas continuam funcionando
page = await abrir()
const cursor = await page.$eval(CARD2, (a) => getComputedStyle(a).cursor)
ok(cursor === 'grab', '11. cursor de "mão aberta" sobre os cards', cursor)
await page.click('.featured .carousel__arrow:last-child')
await espera(900)
ok((await rolagem(page, TRILHA)) > 100, '12. as setas continuam funcionando depois da mudança')
const naoImgDrag = await page.$eval(`${TRILHA} img`, (i) => getComputedStyle(i).webkitUserDrag ?? 'none')
ok(naoImgDrag === 'none', '13. imagens não iniciam o arrasto nativo do navegador')
await page.close()

// ---- 7. o carrossel de depoimentos também é arrastável
page = await abrir()
await page.$eval('.testimonials', (e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }))
await espera(400)
const T = '.testimonials .carousel__track'
c = await centro(page, `${T} li:nth-child(2)`)
await page.mouse.move(c.x, c.y)
await page.mouse.down()
await page.mouse.move(c.x - 350, c.y, { steps: 12 })
await page.mouse.up()
await espera(900)
// (a trilha de depoimentos tem pouco para rolar em 1440 px, ~200 px: o arrasto chega ao fim)
const maximo = await page.$eval(T, (t) => Math.round(t.scrollWidth - t.clientWidth))
ok((await rolagem(page, T)) >= maximo - 2 && maximo > 100, '14. o carrossel de depoimentos também pode ser arrastado (chega ao fim da trilha)', `scrollLeft=${await rolagem(page, T)} de ${maximo}`)
await page.close()

// ---- 8. botão direito do mouse não arrasta
page = await abrir()
c = await centro(page, CARD2)
await page.mouse.move(c.x, c.y)
await page.mouse.down({ button: 'right' })
await page.mouse.move(c.x - 300, c.y, { steps: 8 })
await page.mouse.up({ button: 'right' })
await espera(300)
ok((await rolagem(page, TRILHA)) === 0, '15. arrastar com o botão direito não move o carrossel')
await page.close()

// ---- 9. no fim da rolagem o último card para a uma pequena distância da borda, igual ao espaço entre os cards
async function fimComMargem(caminho, seletor, rotulo, largura = 1440) {
  const p = await browser.newPage()
  await p.setViewport({ width: largura, height: 900 })
  await p.goto(`${BASE}${caminho}`)
  await p.waitForSelector(`${seletor} li`)
  const r = await p.$eval(seletor, (t) => {
    t.scrollLeft = t.scrollWidth
    const lis = [...t.children]
    const ultimo = lis.at(-1).getBoundingClientRect()
    const penultimo = lis.at(-2).getBoundingClientRect()
    return {
      distanciaDaBorda: Math.round(document.documentElement.clientWidth - ultimo.right),
      espacoEntreCards: Math.round(ultimo.left - penultimo.right),
    }
  })
  ok(r.espacoEntreCards > 10 && Math.abs(r.distanciaDaBorda - r.espacoEntreCards) <= 1, `16. ${rotulo}: no fim, o último card fica a ${r.distanciaDaBorda}px da borda, igual ao espaço entre os cards (${r.espacoEntreCards}px)`)
  await p.close()
}
await fimComMargem('/', '.featured .carousel__track', 'Principais cursos (Landing)')
await fimComMargem('/', '.testimonials .carousel__track', 'Depoimentos (Landing)')
await fimComMargem('/cursos/1', '.testimonials .carousel__track', 'Depoimentos (Detalhes)')
await fimComMargem('/', '.featured .carousel__track', 'Principais cursos em 390 px', 390)

console.log(falhas === 0 ? '\nTODOS OS CENÁRIOS DO CARROSSEL PASSARAM' : `\n${falhas} FALHA(S)`)
await browser.close()
process.exit(falhas ? 1 : 0)
