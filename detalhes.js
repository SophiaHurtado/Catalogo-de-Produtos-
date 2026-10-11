// detalhes.js - lógica da página de DETALHES (produto.html?id=1)

// Lê o "id" que está na URL: produto.html?id=5 -> "5"
const parametros = new URLSearchParams(window.location.search);
const idDoProduto = parametros.get("id");

const imagemPrincipal = document.getElementById("imagem-principal");

// Mostra a mensagem de erro na tela
function mostrarErro(mensagem) {
  document.getElementById("mensagem-erro").textContent = mensagem;
  mostrarEstado("erro");
}

// Busca o produto na API
async function carregarProduto() {
  mostrarEstado("carregando");
  if (!idDoProduto) {                     // abriu a página sem ?id=...
    mostrarErro("Nenhum produto foi informado.");
    return;
  }
  try {
    const produto = await buscarDados(URL_API + "/" + idDoProduto);
    mostrarProduto(produto);
  } catch (erro) {
    console.error(erro);
    mostrarErro("Não foi possível carregar este produto. Ele pode não existir ou a conexão falhou.");
  }
}

// Preenche a página com os dados do produto
function mostrarProduto(produto) {
  document.title = produto.title + " - Catálogo de Produtos"; // título da aba do navegador
  document.getElementById("nome").textContent = produto.title;
  document.getElementById("descricao").textContent = produto.description;
  document.getElementById("categoria").textContent = formatarCategoria(produto.category);
  document.getElementById("preco").textContent = formatarPreco(produto.price);
  document.getElementById("desconto").textContent = produto.discountPercentage + "%";

  // Preço final = preço - desconto em porcentagem
  const precoFinal = produto.price * (1 - produto.discountPercentage / 100);
  document.getElementById("preco-final").textContent = formatarPreco(precoFinal);

  document.getElementById("avaliacao").textContent = "★ " + produto.rating.toFixed(1) + " de 5";
  document.getElementById("estoque").textContent = produto.stock + " unidades";

  // Marca: nem todo produto tem, então só mostramos se existir
  if (produto.brand) {
    document.getElementById("marca").textContent = produto.brand;
    document.getElementById("bloco-marca").hidden = false;
  }

  // Tags: só mostramos se houver pelo menos uma
  if (produto.tags && produto.tags.length > 0) {
    const listaTags = document.getElementById("tags");
    for (const tag of produto.tags) {
      const item = document.createElement("li");
      item.textContent = tag;
      listaTags.appendChild(item);
    }
    document.getElementById("bloco-tags").hidden = false;
  }

  montarGaleria(produto);
  mostrarEstado("sucesso");
}

// Mostra a foto principal e as miniaturas clicáveis
function montarGaleria(produto) {
  const fotos = (produto.images && produto.images.length > 0) ? produto.images : [produto.thumbnail];

  imagemPrincipal.alt = "Foto de " + produto.title;
  tratarImagemQuebrada(imagemPrincipal);
  imagemPrincipal.src = fotos[0];

  if (fotos.length < 2) return;           // com uma foto só, não precisa de miniaturas

  const lista = document.getElementById("miniaturas");
  fotos.forEach(function (foto, posicao) {
    const item = document.createElement("li");
    const botao = document.createElement("button"); // <button> funciona com teclado (Tab/Enter)
    botao.type = "button";
    botao.setAttribute("aria-label", "Ver foto " + (posicao + 1) + " de " + fotos.length);

    const miniatura = document.createElement("img");
    miniatura.alt = "";                   // alt vazio: o botão já tem aria-label
    tratarImagemQuebrada(miniatura);
    miniatura.src = foto;

    botao.addEventListener("click", function () {
      imagemPrincipal.src = foto;         // troca a foto grande
    });

    botao.appendChild(miniatura);
    item.appendChild(botao);
    lista.appendChild(item);
  });
}

// Começa tudo quando a página abre
carregarProduto();
