// Confere a ÁRVORE DE ACESSIBILIDADE do Chrome — a mesma que os leitores de tela (NVDA, VoiceOver, Narrator) consomem:
// marcos (landmarks), papéis, nomes acessíveis, níveis de título e estados (expandido, desabilitado, valor).
// Não substitui um teste manual com um leitor de tela real (roteiro em docs/teste-leitor-de-tela.md).
// Pré-requisitos: API (porta 5080) e `npm run dev` rodando, banco com o seed. Variáveis: BASE_URL e CHROME_PATH.
// Uso: npm run test:arvore
import puppeteer from 'puppeteer-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })

let falhas = 0
const ok = (cond, nome, extra = '') => {
  if (!cond) falhas++
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${nome}${extra ? '  -> ' + extra : ''}`)
}

const achatar = (no, saida = []) => {
  if (!no) return saida
  saida.push(no)
  for (const filho of no.children ?? []) achatar(filho, saida)
  return saida
}

async function arvore(caminho, { largura = 1440, antes } = {}) {
  const page = await browser.newPage()
  await page.setViewport({ width: largura, height: 900 })
  await page.goto(`${BASE}${caminho}`)
  await page.waitForSelector('main', { timeout: 8000 })
  await new Promise((r) => setTimeout(r, 1000))
  if (antes) await antes(page)
  const raiz = await page.accessibility.snapshot({ interestingOnly: false })
  return { page, nos: achatar(raiz) }
}
// Regiões "status", itens de lista etc. não têm nome próprio: o que o leitor de tela lê está nos nós de texto filhos.
const textoDe = (no) =>
  achatar(no)
    .filter((n) => n.role === 'StaticText')
    .map((n) => n.name)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
const textosDeStatus = (nos) => nos.filter((n) => n.role === 'status').map(textoDe)
const porPapel = (nos, papel) => nos.filter((n) => n.role === papel)
const nomes = (nos, papel) => porPapel(nos, papel).map((n) => n.name)

// Todo controle interativo precisa de nome acessível: sem ele o leitor de tela diz só "botão" ou "link".
function controlesSemNome(nos) {
  return nos.filter((n) => ['link', 'button', 'textbox', 'combobox', 'searchbox', 'checkbox', 'radio'].includes(n.role) && !(n.name ?? '').trim())
}

// ---------- Landing ----------
{
  const { page, nos } = await arvore('/')
  const h1 = porPapel(nos, 'heading').filter((n) => n.level === 1)
  ok(h1.length === 1 && h1[0].name === 'Impulsione sua carreira na indústria', '1. Landing: um único h1 com o título do hero', h1.map((n) => n.name).join('|'))
  ok(['banner', 'main', 'contentinfo'].every((r) => porPapel(nos, r).length === 1), '1b. marcos banner, main e contentinfo presentes (um de cada)')
  const navs = nomes(nos, 'navigation')
  // (os títulos do rodapé aparecem em caixa alta por CSS, e o Chrome calcula o nome com o texto exibido)
  const navsMin = navs.map((n) => n.toLowerCase())
  ok(['principal', 'navegação', 'cursos populares', 'suporte'].every((n) => navsMin.includes(n)) && new Set(navsMin).size === navsMin.length, '1c. navegações com nomes distintos', navs.join(' | '))
  const regioes = nomes(nos, 'region')
  ok(regioes.includes('Cursos em destaque') && regioes.includes('Depoimentos de alunos'), '1d. carrosséis anunciados como regiões nomeadas', regioes.join(' | '))
  ok(new Set(regioes).size === regioes.length, '1e. nomes de regiões não se repetem')
  const botoes = nomes(nos, 'button')
  ok(botoes.includes('Anterior') && botoes.includes('Próximo'), '1f. botões Anterior/Próximo têm nome acessível')
  ok(controlesSemNome(nos).length === 0, '1g. nenhum link ou botão sem nome acessível', controlesSemNome(nos).map((n) => n.role).join(','))
  ok(porPapel(nos, 'heading').every((n) => n.level >= 1 && n.level <= 3), '1h. níveis de título sem saltos (h1 > h2 > h3)')
  const imagensComNome = porPapel(nos, 'img').filter((n) => (n.name ?? '').trim())
  ok(imagensComNome.every((n) => n.name.length > 3), '1i. imagens informativas têm texto alternativo descritivo', imagensComNome.map((n) => n.name).join(' | '))
  await page.close()
}

// ---------- Catálogo ----------
{
  const { page, nos } = await arvore('/cursos')
  const busca = porPapel(nos, 'search')
  ok(busca.length === 1 && busca[0].name === 'Pesquisar e filtrar cursos', '2. Catálogo: formulário de busca é um marco "search" nomeado', busca.map((n) => n.name).join('|'))
  const campos = [...nomes(nos, 'searchbox'), ...nomes(nos, 'textbox')]
  ok(campos.includes('Pesquisar pelo nome do curso'), '2b. campo de busca tem rótulo', campos.join('|'))
  const combos = nomes(nos, 'combobox')
  ok(['Categoria', 'Modalidade', 'Status'].every((c) => combos.includes(c)), '2c. filtros anunciados com rótulo (Categoria, Modalidade, Status)', combos.join('|'))
  const limpar = nos.find((n) => n.role === 'button' && n.name === 'Limpar filtros')
  ok(limpar?.disabled === true, '2d. "Limpar filtros" é anunciado como desabilitado quando não há filtro')
  ok(textosDeStatus(nos).includes('8 cursos encontrados'), '2e. contagem de resultados é uma região de status (anunciada automaticamente)', textosDeStatus(nos).join(' | '))
  const titulos = porPapel(nos, 'heading').filter((n) => n.level === 2)
  const links = nomes(nos, 'link')
  const cardsOk = titulos.filter((t) => links.includes(t.name))
  ok(cardsOk.length === 8, '2f. cada um dos 8 cards tem título h2 e um link com o mesmo nome (nome acessível = texto visível)', `${cardsOk.length} cards`)
  ok(controlesSemNome(nos).length === 0, '2g. nenhum controle sem nome acessível')
  // anúncio ao filtrar
  await page.select('#status', 'Encerrado')
  await page.waitForFunction(() => /1 curso encontrado/.test(document.querySelector('.catalog__count')?.textContent ?? ''), { polling: 100, timeout: 5000 })
  const depois = achatar(await page.accessibility.snapshot({ interestingOnly: false }))
  ok(textosDeStatus(depois).includes('1 curso encontrado'), '2h. após filtrar, o status passa a "1 curso encontrado" (singular)', textosDeStatus(depois).join(' | '))
  await page.close()
}

// ---------- Catálogo vazio ----------
{
  const { page } = await arvore('/cursos?busca=zzzz')
  await page.waitForFunction(() => document.body.textContent.includes('Nenhum curso encontrado'), { polling: 100, timeout: 5000 })
  const novos = achatar(await page.accessibility.snapshot({ interestingOnly: false }))
  ok(novos.some((n) => n.role === 'heading' && n.name === 'Nenhum curso encontrado'), '3. Catálogo vazio: mensagem de nenhum curso é um título e fica no status')
  ok(textosDeStatus(novos).includes('0 cursos encontrados'), '3b. contagem "0 cursos encontrados" anunciada', textosDeStatus(novos).join(' | '))
  await page.close()
}

// ---------- Detalhes do curso ----------
{
  const { page, nos } = await arvore('/cursos/1')
  const h1 = porPapel(nos, 'heading').filter((n) => n.level === 1)
  ok(h1.length === 1 && h1[0].name.startsWith('Matemática para a Precisão'), '4. Detalhes: um único h1 com o nome do curso')
  const acordeoes = nos.filter((n) => n.role === 'button' && ['Módulos', 'Aulas online e avaliações', 'Dúvidas frequentes'].includes(n.name))
  ok(acordeoes.length === 3 && acordeoes.every((n) => n.expanded === false), '4b. três acordeões anunciados como botões recolhidos (expanded=false)', acordeoes.map((n) => `${n.name}:${n.expanded}`).join(' | '))
  await page.$eval('.accordion__item:nth-child(1) .accordion__button', (e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.click('.accordion__item:nth-child(1) .accordion__button')
  const depois = achatar(await page.accessibility.snapshot({ interestingOnly: false }))
  const modulos = depois.find((n) => n.role === 'button' && n.name === 'Módulos')
  ok(modulos?.expanded === true, '4c. ao abrir, o botão é anunciado como expandido (expanded=true)')
  ok(depois.some((n) => n.role === 'region' && n.name === 'Módulos'), '4d. o painel aberto é uma região com o nome do acordeão')
  const matricula = depois.filter((n) => n.role === 'link' && n.name === 'Matricule-se')
  ok(matricula.length >= 1, '4e. ação principal "Matricule-se" disponível como link')
  ok(controlesSemNome(depois).length === 0, '4f. nenhum controle sem nome acessível')
  await page.close()
}
{
  const { page, nos } = await arvore('/cursos/3')
  const desab = nos.find((n) => n.role === 'button' && /Disponível em/.test(n.name ?? ''))
  ok(desab?.disabled === true, '5. Curso "Em breve": matrícula anunciada como botão desabilitado com a data', desab?.name)
  await page.close()
}

// ---------- AVA ----------
{
  const { page, nos } = await arvore('/ava/1')
  ok(porPapel(nos, 'heading').filter((n) => n.level === 1).length === 1, '6. AVA: um único h1')
  const progresso = nos.find((n) => n.role === 'progressbar')
  ok(progresso?.name === 'Progresso no curso' && Number(progresso?.value) === 10, '6b. progresso é uma barra de progresso nomeada com valor 10', `${progresso?.name} = ${progresso?.value}`)
  ok(nomes(nos, 'navigation').includes('Aulas e módulos'), '6c. menu do curso é uma navegação nomeada')
  ok(nomes(nos, 'link').includes('Voltar para a página do curso'), '6d. seta de voltar tem nome acessível')
  const itemAtual = nos.find((n) => n.role === 'listitem' && textoDe(n).includes('1.2 Boas práticas'))
  ok(Boolean(itemAtual) && /aula atual/.test(textoDe(itemAtual)), '6e. aula atual é identificada por texto ("aula atual"), e não só por ícone', itemAtual && textoDe(itemAtual))
  ok(controlesSemNome(nos).length === 0, '6f. nenhum controle sem nome acessível')
  await page.close()
}

// ---------- 404 ----------
{
  const { page, nos } = await arvore('/pagina-que-nao-existe')
  const h1 = porPapel(nos, 'heading').filter((n) => n.level === 1)
  ok(h1.length === 1 && h1[0].name === 'Página não encontrada', '7. 404: título h1 "Página não encontrada"')
  await page.close()
}

console.log(falhas === 0 ? '\nTODAS AS VERIFICAÇÕES DA ÁRVORE DE ACESSIBILIDADE PASSARAM' : `\n${falhas} FALHA(S)`)
await browser.close()
process.exit(falhas ? 1 : 0)
