//Obter conteiner de notas e o botão
const notesConteiner = document.getElementById('notes-conteiner');
const addNoteBtn = document.getElementById('add-note-btn');

//Criar elemento no HTML
function creatNoteElement(id, content = '', color = '#ffff76ff') {
    const note = document.createElement('div');
    note.classList.add('post-it');
    note.style.backgroundColor = color;
    note.setAttribute('data-id', id);

    const textarea = document.createElement('textarea');
    textarea.classList.add('note-content');
    textarea.value = content;
    textarea.placeholder = 'Digite sua nota...';

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-note-btn');
    deleteBtn.textContent = 'X';

    note.appendChild(textarea);
    note.appendChild(deleteBtn);


deleteBtn.addEventListener('click', () => deleteNote(note, id));

textarea.addEventListener('input', () => updateNoteContent(id, textarea.value));

return note;
}

async function updateNoteContent(id, content) {
    try{
        const response = await fetch('/notes/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                note_id: id,
                user_id: LOGGED_IN_USER_ID,
                content: content
            })
        });
        if(response.ok) {
            console.log(`Conteudo da nota ID ${id} atualizado com sucesso`);
        } else {
            const errorText = await response.text();
            console.error(`Erro ao atualizar conteúdo da nota ID ${id}:`, errorText);
        }
    } catch {
        console.error('Erro de conexão ao atualizar a nota:', error);
    }
}

//Adicionar novo post-it
function addNote() {

    saveNewNote();
}

async function saveNewNote() {
    try{
        const response = await fetch('/notes/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: LOGGED_IN_USER_ID,
                group_name: currentGroupName,
                content: '',
                color: '#ffff76ff'
            })
        });

        if(response.ok) {
            const data = await response.json();
            const newNote = creatNoteElement(data.note_id, '', '#ffff76ff');
            notesConteiner.appendChild(newNote);
            newNote.querySelector('.note-content').focus();
            console.log(`Nota criada com sucesso. ID ${data.note_id}`);
        } else {
            const errorText = await response.text();
            alert('Erro ao criar a nota no servidor' + errorText);
        }
    } catch (error) {
        console.error('Erro na requisição de criação de nota', error);
        alert('Erro de conexão ao criar a nota');
    }
}

function deleteNote(noteElement, id) {
    noteElement.remove();

    deleteNoteStorage(id);
}


async function deleteNoteStorage(id) {
    try{
        const response = await fetch('/notes/delete', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                note_id: id,
                user_id: LOGGED_IN_USER_ID
            })
        });
        if(response.ok) {
            console.log(`Nota ID ${id} deletada com sucesso`);
        } else {
            const errorText = await response.text();
            alert(`Erro ao deletar nota ID ${id}:` + errorText);
        }
    } catch (error) {
        console.error('Erro na requisição de deleção', error);
        alert('Erro de conexão ao deletar a nota');
    }
}

//Botão de adicionar notas
if(addNoteBtn) {
    addNoteBtn.addEventListener('click', addNote);
}
//Script para editar notas
//Script para arrastar e soltar notas
//Script para mudar a cor do post-it e salvar a preferência no localStorage
//Script para salvar a preferência de cor do post-it no localStorage

//Gerenciar o grupo de notas
// Obter o ID
const LOGGED_IN_USER_ID = localStorage.getItem('mindstack_user_id') || 1;
const ulrParams = new URLSearchParams(window.location.search);
const currentGroupName = ulrParams.get('groupId') || 'defalt-group';

//Carregar notas do grupo atual
async function loadNotesCurrentGroup() {
    console.log(`Carregando anotações para o grupo: ${currentGroupName}`);
    try{
    const response = await fetch(`/notes/get/${currentGroupName}/${LOGGED_IN_USER_ID}`);

    if(response.ok) {
        const notes = await response.json();

        notesConteiner.innerHTML = '';

        if(notes.length === 0) {
            console.log('Nenhuma nota encontrada nesse grupo');
        }

        notes.forEach(note => {
            const noteElement = creatNoteElement(note.note_id, note.content, note.color);
            noteElement.style.left = `${note.position_x}px`;
            noteElement.style.top = `${note.position_y}px`;
            notesConteiner.appendChild(noteElement);
        });
    } else {
        const errorText = await response.text();
        console.error('Erro ao buscar notas no servidor', errorText);
    }
    } catch (error) {
        console.error('Erro de conexão ao buscar notas', error);
    }
}

loadNotesCurrentGroup();

const confBtn = document.getElementById('settings-open');
const closeSettingsBtn = document.getElementById('close-settings');
const settingsPanel = document.getElementById('settings-panel');

function openSettingsPanel() {
    settingsPanel.classList.add('active');
}

function closeSettingsPanel() {
    settingsPanel.classList.remove('active');
}

confBtn.addEventListener('click', openSettingsPanel);
closeSettingsBtn.addEventListener('click', closeSettingsPanel);


const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

const storageKey = 'darkModePreference';

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem(storageKey, isDarkMode);
}

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

darkModeToggle.addEventListener('change', toggleDarkMode);


applySavedPreference();

const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const closeLoginBtn = document.getElementById('closeLogin');
const closeSignupBtn = document.getElementById('closeSignup');

const loginForm = document.getElementById('login-form_table');
const signupForm = document.getElementById('signup-form_table');

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

if(loginBtn) {
    loginBtn.addEventListener('click', openLoginForm);
}
if(signupBtn) {
    signupBtn.addEventListener('click', openSignupForm);
}
if(closeLoginBtn) {
    closeLoginBtn.addEventListener('click', closeForms);
}
if(closeSignupBtn) {
    closeSignupBtn.addEventListener('click', closeForms);
}

loginBtn.addEventListener('click', openLoginForm);
signupBtn.addEventListener('click', openSignupForm);
closeLoginBtn.addEventListener('click', closeForms);
closeSignupBtn.addEventListener('click', closeForms);


const loginFormElement = loginForm.querySelector('form');
const signupFormElement = signupForm.querySelector('form');

loginFormElement.addEventListener('submit', function(event) {
    event.preventDefault()
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
        .then(response => {
            if(!response.ok) {
                return response.text().then(text => {throw new Error(text)});
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('mindstack_user_id', data.user_id);
            alert('Login realizado com sucesso');
            window.location.href = 'groups.html';
        })
        .catch(error => {
            alert('Erro no login: ' + error.message);
        })
    });

});

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
        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append('new-username', username);
        urlEncodedData.append('new-email', email);
        urlEncodedData.append('new-password', newPassword);

        fetch('/insertUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
        },
            body: urlEncodedData
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