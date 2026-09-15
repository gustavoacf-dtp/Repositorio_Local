# Just Drums — Site do Davi Ramos

Site portfólio do baterista e professor **Davi Ramos**, para divulgar as aulas
presenciais em Brasília e entorno.

**Stack:** HTML5 semântico + CSS nativo com variáveis + Vanilla JS (Opção A do
briefing). Sem dependências, sem build, sem back-end.

## Como abrir

Abra `index.html` no navegador. Para testar com servidor local:

```bash
python -m http.server 8000   # http://localhost:8000
```

## ⚠️ Mídias que faltam

O site foi construído sem acesso aos arquivos de mídia (eles estavam na máquina
local, não no repositório). O código já aponta para os caminhos corretos e
**não quebra** enquanto os arquivos não existem: a logo some e sobra o nome
escrito, a foto vira um quadro pontilhado e os vídeos ausentes não geram card.

Basta colocar os arquivos nos caminhos abaixo:

| Arquivo | Onde colocar | Se faltar |
|---|---|---|
| Logo | `assets/img/logo.png` | wordmark "JustDrums" sem símbolo |
| Foto de perfil | `assets/img/perfil.jpg` | moldura pontilhada com aviso |
| Vídeos | `assets/video/video-1.mp4` … `video-4.mp4` | card não aparece |

Os vídeos são listados na constante `VIDEOS`, no topo de `assets/js/main.js` —
é lá que se muda nome do arquivo, título do card e capa. Pode ter quantos
quiser; a proporção de cada vídeo é detectada automaticamente, então vertical e
horizontal convivem no mesmo grid sem corte.

## Envio do formulário

Por padrão o formulário abre o e-mail do visitante com a mensagem já montada
para **daviwrrf@gmail.com**. Funciona na hora, sem cadastro em lugar nenhum.

Para o envio acontecer em segundo plano (sem abrir o cliente de e-mail), crie
uma conta gratuita no [Formspree](https://formspree.io) com o e-mail
`daviwrrf@gmail.com` e cole o endpoint na constante `FORMSPREE`, no topo de
`assets/js/main.js`:

```js
var FORMSPREE = 'https://formspree.io/f/seu-codigo';
```

Nos dois casos a confirmação exibida é a mesma:
**"Informações encaminhadas com sucesso! Aguarde meu contato."**

### Regras de validação já implementadas

| Campo | Regra |
|---|---|
| Nome | obrigatório, mínimo 2 caracteres |
| Sobrenome | opcional |
| Sexo | obrigatório, apenas Masculino ou Feminino |
| Sua idade | obrigatório, número inteiro de 1 a 120 |
| Telefone | opcional; se preenchido, precisa ser `(61) 99999-9999` |
| E-mail | obrigatório, formato validado |
| Tenho interesse | checkbox, marcado por padrão |

## Contatos e links usados no site

- WhatsApp: **(61) 99514-9266** — `https://wa.me/5561995149266` com mensagem pronta
- E-mail do professor: **daviwrrf@gmail.com**
- YouTube: [Just Drums Davi Ramos](http://www.youtube.com/@justdrumsDaviRamos)
- Instagram: [@daviramosdrums](https://www.instagram.com/daviramosdrums/)

## Identidade visual

Não havia `tailwind.config.js`, `theme.css`, `variables.css` nem tokens de marca
no diretório, então foi adotado o fallback previsto no briefing: **tema escuro
de alto contraste**, com âmbar (`#f2b53c`) como cor de marca e verde do WhatsApp
nas ações de contato.

Toda a paleta está no `:root` de `assets/css/styles.css`. Quando a paleta oficial
da logo estiver definida, mudar `--accent` e as superfícies ali já reflete no
site inteiro.

## Estrutura

```
index.html              página única
assets/css/styles.css   estilos e variáveis de tema
assets/js/main.js       config (VIDEOS, FORMSPREE), menu, galeria e formulário
assets/img/             logo.png e perfil.jpg
assets/video/           vídeos da galeria
```

Seções: cabeçalho, hero, sobre mim, aulas, galeria de vídeos, redes sociais,
contato e rodapé.

## Publicação

Site estático — qualquer hospedagem serve. No GitHub Pages:
`Settings → Pages → Source: Deploy from a branch`, apontando para a branch e a
pasta raiz.
