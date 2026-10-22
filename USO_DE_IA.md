# Uso de Inteligência Artificial

> Documento mantido ao longo do desenvolvimento. Será completado antes da entrega.

## Ferramenta utilizada

- Claude (Anthropic): Claude Code (extensão VS Code) para o desenvolvimento e a extensão Claude in Chrome para a leitura do protótipo do Figma.

## Registro

### 1. Extração do protótipo do Figma

- **Objetivo:** o arquivo do Figma exige login e não pôde ser lido diretamente pelo Claude Code (HTTP 403). O Claude do navegador, com acesso ao protótipo público, percorreu os 3 fluxos e descreveu textos, cores, estrutura e interações, gerando os arquivos de `docs/design/`.
- **Aproveitado:** textos literais, estrutura das telas, interações e prints de referência.
- **Descartado / ajustado:** as medidas vieram em px do print (não em px de design) e as cores foram obtidas por amostragem de pixel (margem de erro de ±3 por canal). Foram tratadas como aproximação e conferidas visualmente contra os prints.
- **Validação:** conferência dos textos e das interações contra os prints.
