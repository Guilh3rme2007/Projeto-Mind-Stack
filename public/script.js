//Script para criar notas
//Script para conectar com o MySQL
//Script para deletar notas
//Script para editar notas
//Script para arrastar e soltar notas
//Script para mudar a cor do post-it e salvar a preferência no localStorage
//Script para salvar a preferência de cor do post-it no localStorage
//Script para abrir e fechar o menu de configurações

const { response } = require("express");

//Obter elementos
const confBtn = document.getElementById('settings-open');
const closeSettingsBtn = document.getElementById('close-settings');
const settingsPanel = document.getElementById('settings-panel');
//Função para abrir o painel de configurações
function openSettingsPanel() {
    settingsPanel.classList.add('active');
}
//Função para fechar o painel
function closeSettingsPanel() {
    settingsPanel.classList.remove('active');
}
//Adicionar os event listeners
confBtn.addEventListener('click', openSettingsPanel);
closeSettingsBtn.addEventListener('click', closeSettingsPanel);

// Script para alternar entre modo claro e escuro com persistência usando localStorage
//Obter elementos 
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
//Chave para o armazenamento local
const storageKey = 'darkModePreference';
// Função para alternar o modo escuro
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem(storageKey, isDarkMode);
}
// Verificar a preferência do usuário no armazenamento local
//verificar a preferência salva ao carregar a página
function applySavedPreference() {
    const savedPreference = localStorage.getItem(storageKey);

    if(savedPreference === 'true') {
        const isDarkModeSaved = savedPreference === 'true';

        if(isDarkModeSaved) {
            body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    }
}
//Adicionar evento de change ao switch
darkModeToggle.addEventListener('change', toggleDarkMode);

//Aplicar a preferência salva ao carregar a página
applySavedPreference();
//Script para salvar a preferência de modo claro/escuro em todo o aplicativo
//Script para abrir e fechar o menu de login e criar conta
//Obter os botões
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const closeLoginBtn = document.getElementById('closeLogin');
const closeSignupBtn = document.getElementById('closeSignup');
//Obter os formulários
const loginForm = document.getElementById('login-form_table');
const signupForm = document.getElementById('signup-form_table');
//Funções para abrir e fechar
function openLoginForm() {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
}
function openSignupForm() {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
}
function closeForms() {
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');
}
//Adicionar os events listeners
loginBtn.addEventListener('click', openLoginForm);
signupBtn.addEventListener('click', openSignupForm);
closeLoginBtn.addEventListener('click', closeForms);
closeSignupBtn.addEventListener('click', closeForms);
//Funções para validar os formulários
//Obter os elementos
const loginFormElement = loginForm.querySelector('form');
const signupFormElement = signupForm.querySelector('form');
//Validação dos formulários
//Login
loginFormElement.addEventListener('submit', function(event) {
    if(loginFormElement.checkValidity()) {
        event.preventDefault();
        alert('Login realizado co sucesso!');
        window.location.href = 'groups.html';
    }
});
//Cadastro
signupFormElement.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('new-password-confirm').value;
    if(newPassword !== confirmPassword) {
            alert('Erro: Senhas diferentes');
            return;
    }

    if(signupFormElement.checkValidity()) {
        fetch('/insetUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
        },
            body: JSON.stringify({
                'new-username': username,
                'new-email': email,
                'new-password': newPassword
             })
        })
        .then(response => {
            if(!response.ok) {
                return response.text().then(text => {throw new Error(text)});
            }
            return response.text();
        })
        .then(data => {
            alert('Cadastro realizado com sucesso!' + data);
            window.location.href = 'first.html';
        })
        .catch(error => {
            alert('Erro ao cadastrar: ' + error.message);
        });
    } else {
        signupFormElement.reportValidity();
    }
});