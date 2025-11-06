//Script para criar notas
//Script para conectar com o MySQL
//Script para deletar notas
//Script para editar notas
//Script para arrastar e soltar notas
//Script para mudar a cor do post-it e salvar a preferência no localStorage
//Script para salvar a preferência de cor do post-it no localStorage
//Script para abrir e fechar o menu de configurações
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
// Função para alternar o modo escuro
// Verificar a preferência do usuário no armazenamento local
//verificar a preferência salva ao carregar a página
//Adicionar evento de change ao switch
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