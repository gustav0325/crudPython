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


loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Preencha todos os campos.");
        return;
    }

    if (email === "admin@gmail.com" && password === "123") {
        alert("Login realizado com sucesso!");
        window.location.href = "../index.html";
    } else {
        alert("Email ou senha incorretos!");
    }
});


registerForm.addEventListener("submit", function (e) {
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

    alert(`Cadastro realizado com sucesso para ${name}! Você pode fazer login agora.`);
    
    registerForm.reset();
    
    loginCard.classList.remove('hidden');
    registerCard.classList.add('hidden');
});