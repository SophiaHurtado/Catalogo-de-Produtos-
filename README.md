# Catálogo de Produtos

Página responsiva que lista produtos da API pública [DummyJSON](https://dummyjson.com/docs/products), com tela de detalhes.

## Tecnologias utilizadas
- HTML5 (semântico)
- CSS3 (Grid, Flexbox, media queries)
- JavaScript puro (fetch, DOM), sem frameworks e sem backend

## Como executar
1. Baixe ou clone o projeto.
2. Abra o arquivo `index.html` no navegador (duplo clique). É preciso ter internet para acessar a API.
3. Opcional: use a extensão **Live Server** do VS Code, ou rode `python -m http.server` na pasta e acesse `http://localhost:8000`.

## Estrutura
- `index.html` / `script.js`: listagem, busca, filtro, ordenação e paginação
- `produto.html` / `detalhes.js`: detalhes (`produto.html?id=1`)
- `utils.js`: funções compartilhadas (busca na API, formatação, estados, imagem quebrada)
- `style.css`: estilos das duas páginas

## Funcionalidades implementadas
- Tabela de produtos com imagem, nome, categoria, preço, estoque, avaliação e link para detalhes
- Página de detalhes com nome, imagens, descrição, categoria, preço, desconto, preço com desconto, avaliação, estoque, marca e tags (os dois últimos só aparecem quando existem)
- Estados de carregamento, erro (com botão "Tentar novamente"), lista vazia e sucesso
- Diferenciais: busca por nome, filtro por categoria, ordenação por preço e avaliação, paginação, escolha de quantos produtos exibir, imagem alternativa quando a foto falha, URL compartilhável nos detalhes e layout adaptado a celulares

## Decisões técnicas
- **Uma requisição só na listagem** (`?limit=0` traz todos os produtos). Busca, filtro, ordenação e paginação são feitos no navegador, o que deixa o código mais simples.
- **Duas páginas HTML** em vez de rotas: o id vai na URL (`?id=1`) e é lido com `URLSearchParams`, o que permite compartilhar o link.
- **`utils.js`** reúne o que as duas páginas usam, evitando código duplicado.
- **Tabela no celular** (até 640px) vira cards, com o nome da coluna mostrado por `data-label`. Em telas médias a tabela rola na horizontal.
- **Acessibilidade:** `<th scope>`, `alt` nas imagens, `label` nos campos, link "Pular para o conteúdo", foco visível, `role="status"`/`role="alert"` nos estados, cores com bom contraste e respeito a `prefers-reduced-motion`.
