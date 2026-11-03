const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("busca-produto");
const filtroCategoria = document.getElementById("filtro-categoria");

const botaoAbrirCarrinho = document.getElementById("abrir-carrinho");
const botaoFecharCarrinho = document.getElementById("fechar-carrinho");
const painelCarrinho = document.getElementById("painel-carrinho");

const itensCarrinho = document.getElementById("itens-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");
const valorTotal = document.getElementById("valor-total");

let carrinho = [];

try {
  carrinho = JSON.parse(
    localStorage.getItem("nexora-carrinho") || "[]"
  );

  if (!Array.isArray(carrinho)) {
    carrinho = [];
  }
} catch {
  carrinho = [];
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function exibirProdutos() {
  const termo = campoBusca.value.toLowerCase().trim();
  const categoriaSelecionada = filtroCategoria.value;

  const filtrados = produtos.filter(produto => {
    const correspondeBusca =
      produto.nome.toLowerCase().includes(termo) ||
      produto.descricao.toLowerCase().includes(termo);

    const correspondeCategoria =
      categoriaSelecionada === "todos" ||
      produto.categoria === categoriaSelecionada;

    return correspondeBusca && correspondeCategoria;
  });

  listaProdutos.replaceChildren();

  if (filtrados.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Nenhum produto encontrado.";
    listaProdutos.appendChild(mensagem);
    return;
  }

  filtrados.forEach(produto => {
    const card = document.createElement("article");
    card.className = "card-produto";

    const imagem = document.createElement("img");
    imagem.className = "imagem-produto";
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
    imagem.loading = "lazy";

    imagem.onerror = function () {
      this.onerror = null;
      this.src =
        "https://placehold.co/600x400/171020/f472d0?text=" +
        encodeURIComponent(produto.nome);
    };

    const categoria = document.createElement("span");
    categoria.className = "categoria-produto";
    categoria.textContent = produto.categoriaNome;

    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.className = "descricao-produto";
    descricao.textContent = produto.descricao;

    const preco = document.createElement("p");
    preco.className = "preco-produto";
    preco.textContent = formatarPreco(produto.preco);

    const botao = document.createElement("button");
    botao.className = "botao-adicionar";
    botao.type = "button";
    botao.textContent = "Adicionar ao carrinho";

    botao.addEventListener("click", () => {
      adicionarCarrinho(produto.id);
    });

    card.append(
      imagem,
      categoria,
      titulo,
      descricao,
      preco,
      botao
    );

    listaProdutos.appendChild(card);
  });
}

function adicionarCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  const existente = carrinho.find(item => item.id === id);

  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({
      id: id,
      quantidade: 1
    });
  }

  atualizarCarrinho();
}

function removerCarrinho(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  itensCarrinho.replaceChildren();

  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    if (!produto) return;

    total += produto.preco * item.quantidade;
    quantidadeTotal += item.quantidade;

    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    const informacoes = document.createElement("div");

    const nome = document.createElement("h4");
    nome.textContent = produto.nome;

    const quantidade = document.createElement("p");
    quantidade.textContent = `Quantidade: ${item.quantidade}`;

    const preco = document.createElement("p");
    preco.textContent = formatarPreco(
      produto.preco * item.quantidade
    );

    informacoes.append(nome, quantidade, preco);

    const botaoRemover = document.createElement("button");
    botaoRemover.className = "botao-remover";
    botaoRemover.type = "button";
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", () => {
      removerCarrinho(item.id);
    });

    linha.append(informacoes, botaoRemover);
    itensCarrinho.appendChild(linha);
  });

  contadorCarrinho.textContent = quantidadeTotal;
  valorTotal.textContent = formatarPreco(total);

  localStorage.setItem(
    "nexora-carrinho",
    JSON.stringify(carrinho)
  );
}

botaoAbrirCarrinho.addEventListener("click", () => {
  painelCarrinho.hidden = false;
});

botaoFecharCarrinho.addEventListener("click", () => {
  painelCarrinho.hidden = true;
});

document.addEventListener("keydown", evento => {
  if (evento.key === "Escape") {
    painelCarrinho.hidden = true;
  }
});

campoBusca.addEventListener("input", exibirProdutos);
filtroCategoria.addEventListener("change", exibirProdutos);

exibirProdutos();
atualizarCarrinho();
