const API_URL = '/api';

const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
});

showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});


loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert("Login realizado com sucesso!");
            window.location.href = "../home/index.html";
        } else {
            alert(data.message || "Email ou senha incorretos!");
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert("Erro ao conectar com o servidor. Tente novamente.");
    }
});


registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const confirmEmail = document.getElementById("regConfirmEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (name === "" || email === "" || confirmEmail === "" || password === "") {
        alert("Preencha todos os campos.");
        return;
    }

    if (email !== confirmEmail) {
        alert("Os emails digitados não coincidem.");
        return;
    }
    
    if (password.length < 3) {
        alert("A senha deve ter pelo menos 3 caracteres.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Cadastro realizado com sucesso para ${name}! Você pode fazer login agora.`);
            registerForm.reset();
            loginCard.classList.remove('hidden');
            registerCard.classList.add('hidden');
        } else {
            alert(data.message || "Erro ao cadastrar usuário.");
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert("Erro ao conectar com o servidor. Tente novamente.");
    }
});