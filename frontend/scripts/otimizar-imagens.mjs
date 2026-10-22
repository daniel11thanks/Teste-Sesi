// Gera as versões otimizadas (WebP) das fotos do Figma usadas no site; os PNG originais ficam fora do repositório
// (pasta de arquivos do teste), pois pesam 2,6 a 3,8 MB cada.
// Requer o sharp: npm install --no-save sharp. Uso: node scripts/otimizar-imagens.mjs <pasta com os PNG originais>
import sharp from 'sharp'
import { statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const origemDir = process.argv[2]
if (!origemDir) {
  console.error('Informe a pasta com os PNG originais: node scripts/otimizar-imagens.mjs <pasta>')
  process.exit(1)
}
const pasta = fileURLToPath(new URL('../public/assets', import.meta.url))
const itens = [
  ['hero-image.png', 'hero-image.webp', 1920, 68],
  ['banner-ava.png', 'banner-ava.webp', 1200, 74],
  ['video-thumb.png', 'video-thumb.webp', 1100, 74],
]

for (const [origem, destino, largura, qualidade] of itens) {
  await sharp(`${origemDir}/${origem}`)
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: qualidade, effort: 5 })
    .toFile(`${pasta}/${destino}`)
  const antes = (statSync(`${origemDir}/${origem}`).size / 1024).toFixed(0)
  const depois = (statSync(`${pasta}/${destino}`).size / 1024).toFixed(0)
  console.log(`${origem}: ${antes} KB -> ${destino}: ${depois} KB`)
}
