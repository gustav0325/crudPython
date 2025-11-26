const valoresMetro = {
    janela1: 150,
    porta1: 220,
    janelaveneziana: 500,
    vitro: 700,
    janelaPersiana: 800,
    janelaAbrir: 650,
    janelaGuilhotina: 550,
    vitroBasculante: 850
};

let pecaSelecionada = "";

function abrirPopup(peca){
    pecaSelecionada = peca;

    const popup = document.getElementById("popup");
    const titulo = document.getElementById("titulo-popup");
    const resultado = document.getElementById("resultado");
    const img = document.getElementById("popup-img");

    if (peca === "janela1") titulo.innerText = "Janela 2 Folhas";
    if (peca === "porta1") titulo.innerText = "Porta de Correr";
    if (peca === "janela1") titulo.innerText = "Janela 2 Folhas";
    if (peca === "janelaveneziana") titulo.innerText = "Janela Veneziana";
    if (peca === "vitro") titulo.innerText = "Vitro Maxim-Ar";
    if (peca === "janelaPersiana") titulo.innerText = "Janela Persiana";
    if (peca === "janelaAbrir") titulo.innerText = "Janela de Abrir";
    if (peca === "janelaGuilhotina") titulo.innerText = "Janela Guilhotina";
    if (peca === "vitroBasculante") titulo.innerText = "Vitro Basculante";

    const card = document.querySelector(`[data-peca="${peca}"]`);
    const caminhoImagem = card.dataset.imagem;

    img.src = caminhoImagem;

    resultado.innerText = "";

    popup.classList.add("active");
}

function closePopup(){
    document.getElementById("popup").classList.remove("active");
}

function calcular(){
    const altura = parseFloat(document.getElementById("altura").value);
    const largura = parseFloat(document.getElementById("largura").value);
    const resultado = document.getElementById("resultado");

    if (!altura || !largura){
        resultado.innerText = "Digite altura e largura!";
        return;
    }

    const area = altura * largura;
    const valorMetro = valoresMetro[pecaSelecionada];
    const total = area * valorMetro;

    resultado.innerText =
        `Área: ${area.toFixed(2)} m²\nTotal: R$ ${total.toFixed(2)}`;
}
