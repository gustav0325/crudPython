let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];

const lista = document.getElementById("lista-orcamentos");

function carregarHistorico() {
    lista.innerHTML = "";

    if (orcamentos.length === 0) {
        lista.innerHTML = `
            <tr>
                <td colspan="7">Nenhum orçamento registrado ainda.</td>
            </tr>
        `;
        return;
    }

    orcamentos.forEach((item, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${item.peca}</td>
            <td>${item.altura} cm</td>
            <td>${item.largura} cm</td>
            <td>${item.area.toFixed(2)} m²</td>
            <td>R$ ${item.total.toFixed(2)}</td>
            <td>${item.data}</td>
            <td>
                <button class="acao-btn" onclick="remover(${index})">Excluir</button>
            </td>
        `;

        lista.appendChild(linha);
    });
}

function remover(index) {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;

    orcamentos.splice(index, 1);
    localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
    carregarHistorico();
}

carregarHistorico();
