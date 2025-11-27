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

if (!checkAuth()) {
    throw new Error('Não autenticado');
}

async function abrirPopup(peca){
    pecaSelecionada = peca;

    const popup = document.getElementById("popup");
    const titulo = document.getElementById("titulo-popup");
    const resultado = document.getElementById("resultado");
    const img = document.getElementById("popup-img");
    
    // Carregar clientes
    await carregarClientes();

    
    const nomesPecas = {
        "janela1": "Janela 2 Folhas",
        "porta1": "Porta de Correr",
        "janelaveneziana": "Janela Veneziana",
        "vitro": "Vitro Maxim-Ar",
        "janelaPersiana": "Janela Persiana",
        "janelaAbrir": "Janela de Abrir",
        "janelaGuilhotina": "Janela Guilhotina",
        "vitroBasculante": "Vitro Basculante"
    }

    const card = document.querySelector(`[data-peca="${peca}"]`);
    const caminhoImagem = card.dataset.imagem;
    titulo.innerText = nomesPecas[peca] || "Peça";

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
    const clienteId = document.getElementById("cliente").value;
    const resultado = document.getElementById("resultado");

    if (!clienteId){
        resultado.innerText = "Selecione um cliente!";
        return;
    }

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
                cliente_id: parseInt(clienteId),
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

async function carregarClientes() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/clientes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const clientes = await response.json();
            const select = document.getElementById('cliente');
            select.innerHTML = '<option value="">Selecione um cliente</option>';
            
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = `${cliente.nome} - ${cliente.telefone}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

function abrirModalCliente() {
    console.log('Abrindo modal de cliente');
    const modal = document.getElementById('modal-cliente');
    if (modal) {
        modal.classList.add('active');
        console.log('Modal classes:', modal.classList);
    } else {
        console.error('Modal não encontrado!');
    }
}

function fecharModalCliente() {
    document.getElementById('modal-cliente').classList.remove('active');
    document.getElementById('nome-cliente').value = '';
    document.getElementById('telefone-cliente').value = '';
    document.getElementById('endereco-cliente').value = '';
}

async function salvarCliente() {
    const nome = document.getElementById('nome-cliente').value;
    const telefone = document.getElementById('telefone-cliente').value;
    const endereco = document.getElementById('endereco-cliente').value;

    if (!nome || !telefone) {
        alert('Preencha nome e telefone!');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome: nome,
                telefone: telefone,
                endereco: endereco
            })
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');
            fecharModalCliente();
            await carregarClientes();
        } else {
            const data = await response.json();
            alert('Erro ao cadastrar cliente: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        alert('Erro ao salvar cliente');
    }
}
