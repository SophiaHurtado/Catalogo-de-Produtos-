// utils.js - funções usadas pelas DUAS páginas (assim não repetimos código)

// Endereço base da API de produtos (const = valor que nunca muda)
const URL_API = "https://dummyjson.com/products";

// Imagem cinza em SVG, usada quando a foto de um produto não carrega
const IMAGEM_INDISPONIVEL = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
  '<rect width="200" height="200" fill="#e5e7eb"/>' +
  '<text x="100" y="105" font-size="16" text-anchor="middle" fill="#4b5563" font-family="Arial">Sem imagem</text></svg>'
);

// Faz a requisição na API e devolve os dados já convertidos de JSON para objeto
// "async" permite usar "await" (esperar a resposta chegar sem travar a página)
async function buscarDados(url) {
  const resposta = await fetch(url);       // envia o GET e espera a resposta
  if (!resposta.ok) {                      // ok = false quando o status é 404, 500 etc.
    throw new Error("Erro " + resposta.status); // "lança" o erro para o catch de quem chamou
  }
  return await resposta.json();            // converte o corpo da resposta em objeto JavaScript
}

// Mostra só o "estado" pedido (carregando, erro, vazio ou sucesso) e esconde os outros
function mostrarEstado(nomeDoEstado) {
  const estados = ["carregando", "erro", "vazio", "sucesso"];
  for (const estado of estados) {
    const elemento = document.getElementById("estado-" + estado); // procura o bloco na página
    if (elemento) {                        // a página de detalhes não tem o estado "vazio"
      elemento.hidden = (estado !== nomeDoEstado); // esconde todos, menos o escolhido
    }
  }
}

// Transforma o preço (número) em texto de moeda. A API usa dólar
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "USD" });
}

// Transforma "mens-shirts" em "Mens shirts"
function formatarCategoria(texto) {
  const semTraco = texto.replace(/-/g, " ");                   // troca todos os "-" por espaço
  return semTraco.charAt(0).toUpperCase() + semTraco.slice(1); // primeira letra maiúscula
}

// Se a imagem der erro ao carregar, troca pela imagem de "Sem imagem"
function tratarImagemQuebrada(img) {
  // once: true faz o aviso rodar uma vez só (evita loop infinito se o placeholder falhar)
  img.addEventListener("error", function () {
    img.src = IMAGEM_INDISPONIVEL;
  }, { once: true });
}
