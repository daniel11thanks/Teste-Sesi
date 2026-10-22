import puppeteer from 'puppeteer-core'

// Testes de interface do catálogo, com Chrome headless. Pré-requisitos: API (porta 5080) e `npm run dev` rodando,
// banco com o seed original (8 cursos). Variáveis: BASE_URL e CHROME_PATH.
// Uso: npm run test:e2e
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })

let falhas = 0
const ok = (cond, nome, extra = '') => {
  if (!cond) falhas++
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${nome}${extra ? '  -> ' + extra : ''}`)
}
const contagem = () => page.$eval('.catalog__count', (e) => e.textContent.trim())
const cards = () => page.$$eval('.catalog__grid > li', (l) => l.length)
const aguardarContagem = (re) =>
  page.waitForFunction((src) => new RegExp(src).test(document.querySelector('.catalog__count')?.textContent ?? ''), { timeout: 5000, polling: 100 }, re.source)
const url = () => new URL(page.url())

// 1. Carga inicial
await page.goto(`${BASE}/cursos`)
await aguardarContagem(/8 cursos encontrados/)
ok((await cards()) === 8, '1. lista todos os cursos via API', await contagem())

// 2. Busca por nome, sem acento
await page.type('#busca', 'quimica')
await aguardarContagem(/1 curso encontrado/)
ok((await cards()) === 1 && url().searchParams.get('busca') === 'quimica', '2. busca "quimica" (sem acento) -> 1 curso e URL atualizada', await contagem())
const titulo = await page.$eval('.list-card__title', (e) => e.textContent)
ok(/Química/.test(titulo), '2b. curso retornado é Química e Sustentabilidade', titulo)

// 3. Combinar pesquisa + filtros
await page.focus('#busca')
await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control')
await page.type('#busca', 'matematica')
// muda filtros ANTES de a busca (300 ms) ser aplicada: ela não pode apagá-los
await page.select('#categoria', 'matematica')
await page.select('#status', 'Disponivel')
await aguardarContagem(/^1 curso encontrado/)
ok((await cards()) === 1, '3. busca + categoria + status combinados -> 1 curso', await contagem())
const u3 = url().searchParams
ok(u3.get('busca') === 'matematica' && u3.get('categoria') === 'matematica' && u3.get('status') === 'Disponivel', '3b. busca atrasada NÃO apaga filtros escolhidos antes dela', url().search)

// 4. Filtros isolados
await page.click('.filters__clear')
await aguardarContagem(/8 cursos encontrados/)
await page.select('#categoria', 'matematica')
await aguardarContagem(/3 cursos encontrados/)
ok((await cards()) === 3, '4a. categoria Matemática -> 3', await contagem())
await page.select('#categoria', '')
await page.select('#modalidade', 'Hibrido')
await aguardarContagem(/2 cursos encontrados/)
ok((await cards()) === 2, '4b. modalidade Híbrido -> 2', await contagem())
await page.select('#modalidade', '')
await page.select('#status', 'EmBreve')
await aguardarContagem(/2 cursos encontrados/)
ok((await cards()) === 2, '4c. status Em breve -> 2', await contagem())
await page.select('#status', 'Encerrado')
await aguardarContagem(/1 curso encontrado/)
ok((await cards()) === 1, '4d. status Encerrado -> 1 (singular na contagem)', await contagem())

// 5. Nenhum resultado
await page.select('#status', '')
await page.focus('#busca')
await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control')
await page.type('#busca', 'zzzz')
await page.waitForSelector('.feedback')
const vazio = await page.$eval('.feedback', (e) => e.textContent)
ok(/Nenhum curso encontrado/.test(vazio) && (await cards()) === 0, '5. mensagem de nenhum curso encontrado', (await contagem()))

// 6. Limpar filtros (a partir do estado vazio)
await page.select('#categoria', 'linguagens')
await page.click('.catalog__reset')
await aguardarContagem(/8 cursos encontrados/)
const campo = await page.$eval('#busca', (e) => e.value)
const focado = await page.evaluate(() => document.activeElement?.id)
ok(campo === '' && url().search === '' && focado === 'busca', '6. limpar filtros zera busca, filtros, URL e devolve o foco ao campo', `valor="${campo}" url="${url().search}" foco=${focado}`)
const desabilitado = await page.$eval('.filters__clear', (b) => b.disabled)
ok(desabilitado, '6b. botão "Limpar filtros" fica desabilitado sem filtros ativos')

// 7. Link direto e botão Voltar
await page.goto(`${BASE}/cursos?categoria=linguagens`)
await aguardarContagem(/1 curso encontrado/)
const sel = await page.$eval('#categoria', (s) => s.value)
ok(sel === 'linguagens', '7a. link direto com filtro na URL preenche o select', sel)
await page.select('#status', 'Disponivel')
await aguardarContagem(/1 curso encontrado/)
await page.goBack()
await page.waitForFunction(() => document.querySelector('#status').value === '', { timeout: 4000 })
ok(url().searchParams.get('status') === null && url().searchParams.get('categoria') === 'linguagens', '7b. botão Voltar desfaz o último filtro')

// 8. Estado de carregamento
const p2 = await browser.newPage()
await p2.setRequestInterception(true)
p2.on('request', async (req) => {
  if (req.url().includes('/api/cursos?') || req.url().endsWith('/api/cursos')) {
    await new Promise((r) => setTimeout(r, 1500))
    req.continue()
  } else req.continue()
})
await p2.goto(`${BASE}/cursos`, { waitUntil: 'domcontentloaded' })
await p2.waitForSelector('[role=status]')
await new Promise((r) => setTimeout(r, 400))
const carregando = await p2.$eval('main', (m) => m.textContent)
ok(/Carregando cursos/.test(carregando), '8. exibe estado de carregamento enquanto a API responde')
await p2.close()

// 9. Erro da API + "Tentar novamente"
const p3 = await browser.newPage()
await p3.setRequestInterception(true)
let derrubar = true
p3.on('request', (req) => {
  if (derrubar && /\/api\/cursos(\?|$)/.test(req.url())) req.respond({ status: 500, contentType: 'application/json', body: '{}' })
  else req.continue()
})
await p3.goto(`${BASE}/cursos`)
await p3.waitForSelector('[role=alert]')
const erro = await p3.$eval('[role=alert]', (e) => e.textContent)
ok(/servidor está indisponível/.test(erro) && /Tentar novamente/.test(erro), '9a. mensagem de erro em caso de falha (HTTP 500)', erro.slice(0, 70))
derrubar = false
await p3.click('[role=alert] button')
await p3.waitForSelector('.catalog__grid')
ok((await p3.$$eval('.catalog__grid > li', (l) => l.length)) === 8, '9b. "Tentar novamente" recupera a lista')
// API fora do ar (conexão recusada)
const p4 = await browser.newPage()
await p4.setRequestInterception(true)
p4.on('request', (req) => (/\/api\/cursos(\?|$)/.test(req.url()) ? req.abort('connectionrefused') : req.continue()))
await p4.goto(`${BASE}/cursos`)
await p4.waitForSelector('[role=alert]')
ok(/conectar ao servidor/.test(await p4.$eval('[role=alert]', (e) => e.textContent)), '9c. mensagem específica quando não há conexão com a API')

// 10. Acessibilidade básica
const a11y = await page.evaluate(() => {
  const input = document.querySelector('#busca')
  const labels = ['busca', 'categoria', 'modalidade', 'status'].every((id) => document.querySelector(`label[for=${id}]`))
  return { labels, form: document.querySelector('form[role=search]') !== null, live: document.querySelector('.catalog__count').getAttribute('aria-live'), h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang, tipo: input.type }
})
ok(a11y.labels && a11y.form && a11y.live === 'polite' && a11y.h1 === 1 && a11y.lang === 'pt-BR', '10. rótulos associados, role=search, contagem aria-live, 1 h1, lang pt-BR', JSON.stringify(a11y))

// 11. Sem rolagem horizontal em 390px
await page.bringToFront()
await page.setViewport({ width: 390, height: 900 })
await page.goto(`${BASE}/cursos`)
await aguardarContagem(/8 cursos encontrados/)
const largura = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, janela: window.innerWidth }))
ok(largura.doc <= largura.janela, '11. sem rolagem horizontal em 390 px', JSON.stringify(largura))

console.log(falhas === 0 ? '\nTODOS OS CENÁRIOS PASSARAM' : `\n${falhas} FALHA(S)`)
await browser.close()
process.exit(falhas ? 1 : 0)
