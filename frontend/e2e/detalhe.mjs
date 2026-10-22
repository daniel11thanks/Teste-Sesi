// Testes de interface da página de detalhes do curso e do AVA, com Chrome headless.
// Pré-requisitos: API (porta 5080) e `npm run dev` rodando, banco com o seed original. Variáveis: BASE_URL e CHROME_PATH.
import puppeteer from 'puppeteer-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
let falhas = 0
const ok = (cond, nome, extra = '') => {
  if (!cond) falhas++
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${nome}${extra ? '  -> ' + extra : ''}`)
}

async function abrir(caminho, largura = 1440) {
  const page = await browser.newPage()
  await page.setViewport({ width: largura, height: 1000 })
  await page.goto(`${BASE}${caminho}`)
  await page.waitForSelector('main', { timeout: 8000 })
  return page
}
const texto = (page, sel) => page.$eval(sel, (e) => e.textContent.replace(/\s+/g, ' ').trim())
const esperar = (page, fn, arg) => page.waitForFunction(fn, { timeout: 6000, polling: 100 }, arg)

// ---------- Detalhes do curso ----------
let page = await abrir('/cursos/1')
await page.waitForSelector('h1')
ok((await texto(page, 'h1')) === 'Matemática para a Precisão: Medidas e Escalas na Metalurgia', '1. título do curso vindo da API')
// Topo igual ao Figma: só data de início e certificação; os demais dados ficam no bloco "Informações do curso".
const fatos = await texto(page, '.detail-hero__facts')
ok(/Início do curso: 05\/01\/2026/.test(fatos) && /Certificação: SESI/.test(fatos), '2. topo mostra data de início e certificação, como no Figma', fatos)
ok(!/Carga horária|Modalidade|Público-alvo/.test(await texto(page, '.detail-hero')), '2b. topo NÃO repete os dados extras (carga horária, modalidade, público-alvo)')
const info = await texto(page, '.info')
ok(/Informações do curso/.test(info) && /Descrição\s*Aplicação de grandezas/.test(info) && /Status\s*Disponível/.test(info) && /Carga horária\s*60 h/.test(info) && /Modalidade\s*Online/.test(info) && /Público-alvo\s*Operadores/.test(info), '2c. bloco "Informações do curso" traz descrição, status, carga horária, modalidade e público-alvo', info.slice(0, 120))
ok((await page.$eval('.info', (e) => e.closest('.about-section') !== null)), '2d. o bloco fica dentro da seção "Sobre o curso" (faixa abaixo das duas colunas)')
const ordem = await page.evaluate(() => {
  const y = (s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY
  return { hero: y('.detail-hero'), beneficios: y('.benefits-row'), sobre: y('.about'), info: y('.info') }
})
ok(ordem.hero < ordem.beneficios && ordem.beneficios < ordem.sobre && ordem.sobre <= ordem.info, '2e. ordem das seções igual ao Figma (topo, benefícios, sobre) com o bloco dentro de "Sobre"', JSON.stringify(ordem))
ok((await page.$$eval('.detail-benefits li', (l) => l.length)) === 4, '3. quatro benefícios')
ok((await page.title()).startsWith('Matemática para a Precisão'), '3b. título da aba acompanha o curso', await page.title())

// Centraliza o elemento (rolagem instantânea: o site usa scroll-behavior smooth) antes de clicar,
// para o clique não cair sob a barra fixa de matrícula.
const clicar = async (sel) => {
  await page.$eval(sel, (e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.click(sel)
}
const botoes = () => page.$$eval('.accordion__button', (b) => b.map((x) => x.getAttribute('aria-expanded')))
ok(JSON.stringify(await botoes()) === '["false","false","false"]', '4. três acordeões, todos fechados no início')
const rotulos = await page.$$eval('.accordion__button > span:first-child', (s) => s.map((x) => x.textContent))
ok(rotulos.join('|') === 'Módulos|Aulas online e avaliações|Dúvidas frequentes', '4b. títulos dos acordeões', rotulos.join('|'))

await clicar('.accordion__item:nth-child(1) .accordion__button')
await clicar('.accordion__item:nth-child(3) .accordion__button')
ok(JSON.stringify(await botoes()) === '["true","false","true"]', '5. acordeões abrem de forma independente')
ok((await page.$$eval('.accordion__item:nth-child(1) .syllabus > li', (l) => l.length)) === 10, '5b. Módulos lista os 10 módulos')
ok((await page.$$eval('.accordion__item:nth-child(3) .syllabus > section', (l) => l.length)) === 10, '5c. Dúvidas frequentes lista as 10 perguntas')
const primeiroModulo = await texto(page, '.accordion__item:nth-child(1) .syllabus > li:first-child h4')
ok(primeiroModulo === '1. Introdução à Matemática na Metalurgia', '5d. módulo numerado como no Figma', primeiroModulo)
const regiao = await page.$eval('.accordion__item:nth-child(1) .accordion__panel', (p) => ({ role: p.getAttribute('role'), rotulo: p.getAttribute('aria-labelledby') === document.querySelector('.accordion__item:nth-child(1) .accordion__button').id }))
ok(regiao.role === 'region' && regiao.rotulo, '5e. painel é region rotulada pelo botão')
await clicar('.accordion__item:nth-child(1) .accordion__button')
ok(JSON.stringify(await botoes()) === '["false","false","true"]', '5f. clicar de novo fecha só aquele acordeão')
// teclado: Enter no botão alterna
await page.focus('.accordion__item:nth-child(2) .accordion__button')
await page.keyboard.press('Enter')
ok((await botoes())[1] === 'true', '5g. acordeão abre com o teclado (Enter)')

ok((await page.$$eval('.testimonial', (l) => l.length)) === 5, '6. cinco depoimentos')
const mail = await page.$eval('.contact a', (a) => a.getAttribute('href'))
ok(mail.startsWith('mailto:contato@sesindustria.com.br'), '7. "Mandar uma mensagem" abre e-mail', mail)

const barra = await page.$eval('.enroll-bar', (b) => ({ pos: getComputedStyle(b).position, texto: b.textContent.replace(/\s+/g, ' ').trim() }))
ok(barra.pos === 'fixed' && /Matricule-se/.test(barra.texto) && /Matemática para a Precisão/.test(barra.texto), '8. barra de matrícula fixa com o nome do curso')

// Coluna do texto "Sobre o curso" fixa na rolagem, como no Figma (o conteúdo dos acordeões rola ao lado)
if ((await botoes())[0] !== 'true') await clicar('.accordion__item:nth-child(1) .accordion__button') // Módulos aberto: coluna da direita bem alta
const fixa = async (y) => {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
  await new Promise((r) => setTimeout(r, 250))
  return page.$eval('.about__fixed', (e) => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom) } })
}
const caixa = await page.evaluate(() => { const r = document.querySelector('.about').getBoundingClientRect(); return { topo: r.top + window.scrollY, alto: r.height } })
ok((await page.$eval('.about__fixed', (e) => getComputedStyle(e).position)) === 'sticky', '8b. em desktop a coluna do texto é "sticky"')
const antesDela = await fixa(caixa.topo - 400)
ok(antesDela.top >= 380, '8c. antes da seção a coluna está na posição natural (ainda não grudou)', JSON.stringify(antesDela))
const noMeio = await fixa(caixa.topo + caixa.alto * 0.5)
ok(noMeio.top >= 0 && noMeio.top <= 8, '8d. no meio da seção a coluna fica fixa no topo da tela (como no Figma, ~4 px da borda)', JSON.stringify(noMeio))
const maisAFrente = await fixa(caixa.topo + caixa.alto * 0.7)
ok(maisAFrente.top >= 0 && maisAFrente.top <= 8, '8e. continua fixa enquanto a coluna da direita ainda rola', JSON.stringify(maisAFrente))
const fim = await fixa(caixa.topo + caixa.alto - 120)
const limite = await page.$eval('.about', (e) => Math.round(e.getBoundingClientRect().bottom))
ok(fim.bottom <= limite + 1, '8f. no fim da seção a coluna sai junto, sem encobrir a faixa de informações', `coluna termina em ${fim.bottom}, seção em ${limite}`)
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))

await Promise.all([page.waitForNavigation(), page.click('.detail-hero__info a.btn')])
ok(new URL(page.url()).pathname === '/ava/1', '9. "Matricule-se" leva ao AVA do curso', new URL(page.url()).pathname)
await page.close()

// Status: só cursos disponíveis aceitam matrícula
page = await abrir('/cursos/3')
await page.waitForSelector('.detail-hero__info .btn')
let b = await page.$eval('.detail-hero__info .btn', (x) => ({ t: x.textContent.trim(), d: x.disabled, tag: x.tagName }))
ok(b.tag === 'BUTTON' && b.d && b.t === 'Disponível em 16/11/2026', '10a. curso "Em breve": matrícula desabilitada com a data', b.t)
await page.close()
page = await abrir('/cursos/5')
await page.waitForSelector('.detail-hero__info .btn')
b = await page.$eval('.detail-hero__info .btn', (x) => ({ t: x.textContent.trim(), d: x.disabled }))
ok(b.d && b.t === 'Inscrições encerradas', '10b. curso "Encerrado": matrícula desabilitada', b.t)
await page.close()

// Não encontrado / erro
for (const caminho of ['/cursos/999', '/cursos/abc']) {
  page = await abrir(caminho)
  // .feedback também é usado no estado "Carregando": espera pelo texto final, não só pelo seletor.
  await esperar(page, () => /Curso não encontrado/.test(document.querySelector('main')?.textContent ?? ''))
  ok(/Curso não encontrado/.test(await texto(page, 'main h1')), `11. ${caminho} mostra "Curso não encontrado" (título h1)`)
  await page.close()
}
page = await browser.newPage()
await page.setRequestInterception(true)
page.on('request', (req) => (/\/api\/cursos\/\d+/.test(req.url()) ? req.respond({ status: 500, contentType: 'application/json', body: '{}' }) : req.continue()))
await page.goto(`${BASE}/cursos/1`)
await page.waitForSelector('[role=alert]')
ok(/Tentar novamente/.test(await texto(page, '[role=alert]')), '12. erro da API mostra mensagem e "Tentar novamente"')
await page.close()

// ---------- AVA ----------
page = await abrir('/ava/1')
await page.waitForSelector('h1')
ok((await texto(page, 'h1')) === 'Boas práticas' && /Recomendações/.test(await texto(page, '.ava__article')), '13. conteúdo da aula "Boas práticas" e "Recomendações"')
ok((await page.$('header')) === null && (await page.$('footer')) === null, '13b. AVA tem layout próprio, sem header e footer do site')
const side = await texto(page, '.ava__sidebar')
ok(/Matemática para a Precisão: Medidas e Escalas na Metalurgia/.test(side) && /1\.1 Introdução/.test(side) && /1\.2 Boas práticas/.test(side) && /1\.3 Extras/.test(side), '14. menu lateral com título do curso e aulas da introdução')
const prog = await page.$eval('[role=progressbar]', (p) => p.getAttribute('aria-valuenow'))
ok(prog === '10', '14b. barra de progresso acessível (10%)', prog)
const atual = await texto(page, '[aria-current=page]')
ok(/1\.2 Boas práticas/.test(atual), '14c. aula atual marcada com aria-current', atual)
ok((await page.$$eval('.ava__module', (l) => l.length)) === 10, '14d. um item de menu por módulo do curso (10)')

await page.type('#ava-busca', 'modulo 3')
await esperar(page, () => document.querySelectorAll('.ava__module').length === 1)
ok(/Módulo 3/.test(await texto(page, '.ava__module')), '15a. busca no menu filtra os módulos (sem acento)', await texto(page, '.ava__module'))
await page.click('#ava-busca', { clickCount: 1 })
await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control')
await page.type('#ava-busca', 'zzzz')
await esperar(page, () => /Nenhum item encontrado/.test(document.querySelector('.ava__sidebar').textContent))
ok(true, '15b. busca sem resultado mostra "Nenhum item encontrado"')

await Promise.all([page.waitForNavigation(), page.click('.ava__back')])
ok(new URL(page.url()).pathname === '/cursos/1', '16. seta de voltar leva à página do curso', new URL(page.url()).pathname)
await page.close()

// ---------- Responsivo ----------
for (const caminho of ['/cursos/1', '/ava/1', '/']) {
  page = await abrir(caminho, 390)
  await new Promise((r) => setTimeout(r, 800))
  const l = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, janela: window.innerWidth }))
  ok(l.doc <= l.janela, `17. sem rolagem horizontal em 390 px: ${caminho}`, JSON.stringify(l))
  if (caminho === '/ava/1') {
    const antes = await page.$eval('#ava-menu', (m) => getComputedStyle(m).display)
    await page.click('.ava__toggle')
    const depois = await page.$eval('#ava-menu', (m) => getComputedStyle(m).display)
    ok(antes === 'none' && depois !== 'none', '17b. no celular o menu do AVA começa recolhido e abre pelo botão', `${antes} -> ${depois}`)
  }
  await page.close()
}

// ---------- Coluna fixa: só em telas largas e altas; no celular e em telas baixas rola junto ----------
for (const [largura, altura, rotulo] of [[390, 900, 'celular (390 px)'], [800, 900, 'tablet (800 px)'], [1440, 500, 'tela baixa (500 px de altura)']]) {
  page = await browser.newPage()
  await page.setViewport({ width: largura, height: altura })
  await page.goto(`${BASE}/cursos/1`)
  await page.waitForSelector('.about__fixed')
  const pos = await page.$eval('.about__fixed', (e) => getComputedStyle(e).position)
  ok(pos === 'static', `18. coluna do texto NÃO é fixa em ${rotulo}: rola junto`, pos)
  await page.close()
}

console.log(falhas === 0 ? '\nTODOS OS CENÁRIOS PASSARAM' : `\n${falhas} FALHA(S)`)
await browser.close()
process.exit(falhas ? 1 : 0)
