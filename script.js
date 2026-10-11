// script.js - lógica da página de LISTAGEM

let todosProdutos = []; // guarda todos os produtos vindos da API
let paginaAtual = 1;    // página que o usuário está vendo

// Pegamos os elementos da página uma vez só e guardamos em variáveis
const campoBusca = document.getElementById("busca");
const selectCategoria = document.getElementById("categoria");
const selectOrdem = document.getElementById("ordem");
const selectPorPagina = document.getElementById("por-pagina");
const corpoTabela = document.getElementById("corpo-tabela");
const resumo = document.getElementById("resumo");
const infoPagina = document.getElementById("info-pagina");
const botaoAnterior = document.getElementById("anterior");
const botaoProxima = document.getElementById("proxima");

// Busca os produtos na API e mostra na tela
async function carregarProdutos() {
  mostrarEstado("carregando");                         // mostra "Carregando..." enquanto espera
  try {
    const dados = await buscarDados(URL_API + "?limit=0"); // limit=0 pede TODOS os produtos
    todosProdutos = dados.products;                    // a lista fica na propriedade "products"
    preencherCategorias();                             // monta as opções do filtro de categoria
    atualizarLista();                                  // desenha a tabela
  } catch (erro) {
    console.error(erro);                               // registra o erro no console (ajuda a depurar)
    mostrarEstado("erro");                             // mostra a mensagem de erro na tela
  }
}

// Cria as opções do select de categoria sem repetir nomes
function preencherCategorias() {
  const categorias = [];
  for (const produto of todosProdutos) {
    if (!categorias.includes(produto.category)) {      // só adiciona se ainda não estiver na lista
      categorias.push(produto.category);
    }
  }
  categorias.sort();                                   // ordem alfabética
  selectCategoria.length = 1;                          // mantém só "Todas" (evita duplicar ao tentar de novo)
  for (const categoria of categorias) {
    const opcao = document.createElement("option");    // cria <option>
    opcao.value = categoria;                           // valor usado no filtro
    opcao.textContent = formatarCategoria(categoria);  // texto que o usuário vê
    selectCategoria.appendChild(opcao);                // coloca dentro do select
  }
}

// Aplica busca, filtro de categoria e ordenação; devolve a lista resultante
function filtrarProdutos() {
  const texto = campoBusca.value.trim().toLowerCase(); // texto digitado, sem espaços nas pontas
  const categoria = selectCategoria.value;

  // filter() cria uma NOVA lista só com os produtos que passam nas duas condições
  const resultado = todosProdutos.filter(function (produto) {
    const combinaNome = produto.title.toLowerCase().includes(texto);
    const combinaCategoria = categoria === "todas" || produto.category === categoria;
    return combinaNome && combinaCategoria;
  });

  // sort() ordena a lista; se (a - b) for negativo, "a" vem antes de "b"
  const ordem = selectOrdem.value;
  if (ordem === "preco-menor") resultado.sort((a, b) => a.price - b.price);
  if (ordem === "preco-maior") resultado.sort((a, b) => b.price - a.price);
  if (ordem === "avaliacao-maior") resultado.sort((a, b) => b.rating - a.rating);
  if (ordem === "avaliacao-menor") resultado.sort((a, b) => a.rating - b.rating);

  return resultado;
}

// Cria uma linha (<tr>) da tabela para um produto
function criarLinha(produto) {
  const linha = document.createElement("tr");
  // data-label é usado pelo CSS no celular, onde a tabela vira "cards"
  // O nome do produto é <th scope="row">: cabeçalho da linha (bom para acessibilidade)
  linha.innerHTML = `
    <td data-label="Imagem"></td>
    <th scope="row" data-label="Produto">${produto.title}</th>
    <td data-label="Categoria">${formatarCategoria(produto.category)}</td>
    <td data-label="Preço">${formatarPreco(produto.price)}</td>
    <td data-label="Estoque">${produto.stock}</td>
    <td data-label="Avaliação"><span class="so-leitor">Nota </span>★ ${produto.rating.toFixed(1)}<span class="so-leitor"> de 5</span></td>
    <td data-label="Ações">
      <a class="botao" href="produto.html?id=${produto.id}">Ver detalhes<span class="so-leitor"> de ${produto.title}</span></a>
    </td>`;

  // A imagem é criada à parte para podermos tratar o erro de carregamento
  const img = document.createElement("img");
  img.alt = "Foto de " + produto.title;   // texto alternativo
  img.width = 64;                         // tamanho reservado (evita a página "pular")
  img.height = 64;
  img.loading = "lazy";                   // só carrega quando aparece na tela
  tratarImagemQuebrada(img);              // define o plano B antes de definir o src
  img.src = produto.thumbnail;            // imagem principal do produto
  linha.firstElementChild.appendChild(img); // coloca a imagem na primeira célula
  return linha;
}

// Redesenha a tabela de acordo com filtros, ordenação e página atual
function atualizarLista() {
  const filtrados = filtrarProdutos();

  if (filtrados.length === 0) {           // nada encontrado: estado "vazio"
    mostrarEstado("vazio");
    return;                               // sai da função
  }

  const porPagina = Number(selectPorPagina.value);            // converte o texto do select em número
  const totalPaginas = Math.ceil(filtrados.length / porPagina); // arredonda para cima
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas; // evita ficar numa página que não existe

  const inicio = (paginaAtual - 1) * porPagina;               // posição do primeiro item da página
  const daPagina = filtrados.slice(inicio, inicio + porPagina); // recorta só os itens da página

  corpoTabela.innerHTML = "";             // limpa as linhas antigas
  for (const produto of daPagina) {
    corpoTabela.appendChild(criarLinha(produto)); // adiciona uma linha por produto
  }

  resumo.textContent = filtrados.length + " produto(s) encontrado(s)";
  infoPagina.textContent = "Página " + paginaAtual + " de " + totalPaginas;
  botaoAnterior.disabled = (paginaAtual === 1);               // desativa "Anterior" na primeira página
  botaoProxima.disabled = (paginaAtual === totalPaginas);     // desativa "Próxima" na última
  mostrarEstado("sucesso");
}

// Quando muda um filtro, volta para a página 1 e redesenha
function aoMudarFiltro() {
  paginaAtual = 1;
  atualizarLista();
}

// "input" dispara a cada letra digitada; "change" dispara quando o select muda
campoBusca.addEventListener("input", aoMudarFiltro);
selectCategoria.addEventListener("change", aoMudarFiltro);
selectOrdem.addEventListener("change", aoMudarFiltro);
selectPorPagina.addEventListener("change", aoMudarFiltro);

botaoAnterior.addEventListener("click", function () {
  paginaAtual = paginaAtual - 1;
  atualizarLista();
  window.scrollTo({ top: 0 });            // volta ao topo da página
});

botaoProxima.addEventListener("click", function () {
  paginaAtual = paginaAtual + 1;
  atualizarLista();
  window.scrollTo({ top: 0 });
});

// Botão do estado de erro: tenta buscar de novo
document.getElementById("botao-tentar").addEventListener("click", carregarProdutos);

// Botão do estado vazio: volta os filtros ao normal
document.getElementById("botao-limpar").addEventListener("click", function () {
  campoBusca.value = "";
  selectCategoria.value = "todas";
  aoMudarFiltro();
});

// Começa tudo quando a página abre
carregarProdutos();
