#!/usr/bin/env bash
# Executa um comando e, se ele falhar, publica as linhas de erro como anotações do GitHub Actions
# (aparecem no topo da execução e na API pública), em vez de ficarem escondidas no meio do log.
# Uso: bash .github/scripts/executar-com-anotacoes.sh <comando> [argumentos...]
set -u

saida="$(mktemp)"
"$@" 2>&1 | tee "$saida"
codigo="${PIPESTATUS[0]}"

if [ "$codigo" -ne 0 ]; then
  echo "::group::Resumo da falha (comando: $*)"
  grep -E "FAIL|FALHA|Failed |error|Error|erro CS|ERRO" "$saida" | head -10 | while IFS= read -r linha; do
    echo "::error title=Falha em: ${1##*/} ${2:-}::${linha:0:400}"
  done
  echo "::endgroup::"
fi

exit "$codigo"
