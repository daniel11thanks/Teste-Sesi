import { SearchGlyph } from '../ui/Glyphs'
import './CourseFilters.css'

/**
 * Barra de busca e filtros do catálogo. É controlada pela página: recebe os valores e avisa as mudanças.
 * `opcoes` vem de GET /api/filtros; se ainda não carregou, os selects mostram só "Todas/Todos".
 */
export default function CourseFilters({ texto, onTexto, valores, onFiltro, opcoes, onLimpar, temFiltros }) {
  const selects = [
    { chave: 'categoria', rotulo: 'Categoria', todas: 'Todas', itens: opcoes?.categorias.map((c) => [c.slug, c.nome]) },
    { chave: 'modalidade', rotulo: 'Modalidade', todas: 'Todas', itens: opcoes?.modalidades.map((m) => [m.valor, m.rotulo]) },
    { chave: 'status', rotulo: 'Status', todas: 'Todos', itens: opcoes?.status.map((s) => [s.valor, s.rotulo]) },
  ]

  return (
    <form className="filters" role="search" aria-label="Pesquisar e filtrar cursos" onSubmit={(e) => e.preventDefault()}>
      <div className="filters__field filters__field--search">
        <label htmlFor="busca">Pesquisar pelo nome do curso</label>
        <div className="filters__search">
          <SearchGlyph width={18} height={18} />
          <input
            id="busca"
            type="search"
            name="busca"
            value={texto}
            onChange={(e) => onTexto(e.target.value)}
            placeholder="Ex.: matemática, química, estatística"
            autoComplete="off"
            maxLength={100}
          />
        </div>
      </div>

      {selects.map(({ chave, rotulo, todas, itens }) => (
        <div key={chave} className="filters__field">
          <label htmlFor={chave}>{rotulo}</label>
          <select id={chave} name={chave} value={valores[chave]} onChange={(e) => onFiltro(chave, e.target.value)}>
            <option value="">{todas}</option>
            {(itens ?? []).map(([valor, nome]) => (
              <option key={valor} value={valor}>
                {nome}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button type="button" className="filters__clear" onClick={onLimpar} disabled={!temFiltros}>
        Limpar filtros
      </button>
    </form>
  )
}
