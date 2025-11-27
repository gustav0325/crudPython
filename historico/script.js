const API_URL = '/api';

let orcamentos = [];
const lista = document.getElementById("lista-orcamentos");

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você precisa fazer login primeiro!");
        window.location.href = "../login/index.html";
        return false;
    }
    return true;
}

// Verificar autenticação ao carregar página
if (!checkAuth()) {
    throw new Error('Não autenticado');
}

async function carregarHistorico() {
    lista.innerHTML = '<tr><td colspan="9">Carregando...</td></tr>';

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orcamentos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar orçamentos');
        }

        orcamentos = await response.json();
        lista.innerHTML = "";

        if (orcamentos.length === 0) {
            lista.innerHTML = `
                <tr>
                    <td colspan="9">Nenhum orçamento registrado ainda.</td>
                </tr>
            `;
            return;
        }

        orcamentos.forEach((item) => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${item.cliente_nome || 'N/A'}</td>
                <td>${item.cliente_telefone || 'N/A'}</td>
                <td>${item.peca}</td>
                <td>${item.altura} cm</td>
                <td>${item.largura} cm</td>
                <td>${item.area.toFixed(2)} m²</td>
                <td>R$ ${item.total.toFixed(2)}</td>
                <td>${item.data}</td>
                <td>
                    <button class="acao-btn" onclick="remover(${item.id})">Excluir</button>
                </td>
            `;

            lista.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        lista.innerHTML = `
            <tr>
                <td colspan="9">Erro ao carregar histórico. Tente novamente.</td>
            </tr>
        `;
    }
}

async function remover(id) {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orcamentos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Orçamento excluído com sucesso!");
            carregarHistorico();
        } else {
            alert("Erro ao excluir orçamento.");
        }
    } catch (error) {
        console.error('Erro ao excluir:', error);
        alert("Erro ao conectar com o servidor.");
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "../login/index.html";
}

carregarHistorico();
