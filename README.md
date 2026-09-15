# Site — Davi Aulas de Bateria

Site institucional de página única para divulgar e vender aulas de bateria.
HTML, CSS e JavaScript puros: **nenhuma dependência, nenhum build, nenhum servidor**.

> ⚠️ **Conteúdo provisório.** Este site foi construído sem o arquivo
> `claude_instructions.md` (ele não está no repositório). Todo dado de negócio
> — telefone, valores, bio, endereço, depoimentos — está como **placeholder**
> e precisa ser substituído. Os pontos estão marcados com `AJUSTAR` no código
> e listados no checklist abaixo.

## Como abrir

Basta abrir `index.html` no navegador. Para testar com um servidor local:

```bash
python -m http.server 8000
# depois acesse http://localhost:8000
```

## Estrutura

```
index.html              página única (hero, sobre, aulas, método, planos,
                        depoimentos, dúvidas, contato)
assets/css/styles.css   todo o estilo, com variáveis de tema no :root
assets/js/main.js       menu, animações, metrônomo e formulário
assets/img/             pasta para as fotos (ainda vazia)
```

## Checklist do que falta preencher

| Onde | O que ajustar |
|---|---|
| `assets/js/main.js` → `WHATSAPP` | número real em formato `55DDNNNNNNNNN` |
| `index.html` → seção **Contato** | telefone, e-mail, Instagram, endereço, horários |
| `index.html` → links `wa.me/5500000000000` | 2 ocorrências (contato e botão flutuante) |
| `index.html` → seção **Sobre** | biografia real do Davi |
| `index.html` → `.stats` | números reais (`data-count` e o texto visível) |
| `index.html` → seção **Planos** | valores, formas de pagamento, reposição |
| `index.html` → seção **Depoimentos** | depoimentos reais, com autorização de uso |
| `index.html` → **Dúvidas** | idade mínima e política de remarcação |
| `index.html` → `<title>` e `og:*` | nome comercial e cidade, se houver |
| `assets/img/` | foto do Davi e fotos do estúdio |

Trocar a identidade visual é uma edição só: as cores vivem em `--bg`,
`--accent` e companhia, no `:root` de `styles.css` (há um bloco equivalente
para tema claro em `prefers-color-scheme: light`).

## O que já está implementado

- Layout responsivo (uma coluna no celular, duas no desktop) com menu sanduíche
- Tema escuro e claro automáticos, seguindo a preferência do sistema
- Metrônomo funcional via Web Audio API, com 40–208 BPM e acento no tempo 1
- Formulário que monta a mensagem e abre o WhatsApp — sem back-end e sem
  armazenar dados
- Máscara de telefone e validação de nome/telefone antes do envio
- Animações de entrada, contagem dos números e destaque do item de menu ativo
- Acessibilidade: `skip link`, foco visível, `aria-*` nos componentes
  interativos e respeito a `prefers-reduced-motion`
- Estilo de impressão que esconde os elementos interativos

## Publicação

Por ser um site estático, qualquer hospedagem serve. Com GitHub Pages:
`Settings → Pages → Source: Deploy from a branch`, apontando para a branch e
a pasta raiz.
