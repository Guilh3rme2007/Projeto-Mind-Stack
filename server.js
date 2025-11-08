const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const res = require('express/lib/response');

const app = express();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'MindStack_DB',
    port: 3306
});

connection.connect(err => {
    if(err) {
        console.error('Erro ao conectar ao banco de dados.', err);
    }
    console.log('Conectado ao banco de dados.' +connection.threadId);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());


app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/insertUser', (req, res) =>{
    const {
        'new-username': username,
        'new-email': email,
        'new-password':password
    } = req.body;
});

const sql = 'INSERT INTO user (username,email,password) VALUES (?, ?, ?)';

connection.query(sql, [username, email, password], (err, result) => {
    if(err) {
        console.error('Erro ao inserir usuário', err);
        if(err.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('Usuário ou email já cadastrado.');
        }
        return res.status(500).send('Erro interno do servidor ao criar a conta');
    }
    console.log('Usuário inserido com sucesso. ID:', result.insertId);
});

app.get('/first.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'first.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em https://localhost:${PORT}`);
});