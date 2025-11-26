const API_URL = '/api';

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

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você precisa fazer login primeiro!");
        window.location.href = "../login/index.html";
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "../login/index.html";
}

// Verificar autenticação ao carregar página
if (!checkAuth()) {
    throw new Error('Não autenticado');
}

function abrirPopup(peca){
    pecaSelecionada = peca;

    const popup = document.getElementById("popup");
    const titulo = document.getElementById("titulo-popup");
    const resultado = document.getElementById("resultado");
    const img = document.getElementById("popup-img");

    if (peca === "janela1") titulo.innerText = "Janela 2 Folhas";
    if (peca === "porta1") titulo.innerText = "Porta de Correr";
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

async function calcular(){
    const altura = parseFloat(document.getElementById("altura").value);
    const largura = parseFloat(document.getElementById("largura").value);
    const resultado = document.getElementById("resultado");

    if (!altura || !largura){
        resultado.innerText = "Digite altura e largura!";
        return;
    }

    const alturaM = altura / 100;
    const larguraM = largura / 100;
    
    const area = alturaM * larguraM;
    const valorMetro = valoresMetro[pecaSelecionada];
    const total = area * valorMetro;

    // Obter nome da peça
    const titulo = document.getElementById("titulo-popup").innerText;

    // Salvar orçamento na API
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orcamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                peca: titulo,
                altura: altura,
                largura: largura,
                area: area,
                total: total
            })
        });

        if (response.ok) {
            resultado.innerText = `Área: ${area.toFixed(2)} m²\nTotal: R$ ${total.toFixed(2)}\n\n✅ Orçamento salvo!`;
        } else {
            resultado.innerText = `Área: ${area.toFixed(2)} m²\nTotal: R$ ${total.toFixed(2)}\n\n⚠️ Erro ao salvar`;
        }
    } catch (error) {
        console.error('Erro ao salvar orçamento:', error);
        resultado.innerText = `Área: ${area.toFixed(2)} m²\nTotal: R$ ${total.toFixed(2)}\n\n⚠️ Erro ao salvar`;
    }
}

function filtrarItens() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.item');
    
    items.forEach(item => {
        const text = item.querySelector('p').textContent.toLowerCase();
        if (text.includes(searchInput)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
