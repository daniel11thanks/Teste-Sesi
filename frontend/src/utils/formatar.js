/** "2026-01-05" → "05/01/2026" (sem passar por Date, para não sofrer deslocamento de fuso). */
export function formatarData(iso) {
  if (!iso) return null
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

export const formatarCargaHoraria = (horas) => `${horas} h`

export const rotuloQuantidade = (n) => `${n} ${n === 1 ? 'curso encontrado' : 'cursos encontrados'}`
