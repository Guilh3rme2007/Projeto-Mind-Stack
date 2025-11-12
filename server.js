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
    port: 3306,
    password: 'Guilh3rme2007'
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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/insertUser', (req, res) =>{
    const {
        'new-username': username,
        'new-email': email,
        'new-password':password
    } = req.body;

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
    res.status(201).send('Usuário criado com sucesso.');
    });

});

app.post('/login', (req, res) =>{
    const {email, password} =req.body;

    if(!email || !password) {
        return res.status(400).send('Email e senha são obrigatórios');
    }
    const sql = 'SELECT user_id, password FROM user WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if(err){
            console.error('Erro na busca do login:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        if(results.length === 0) {
            return res.status(401).send('Email ou senha inválidos');
        }
        const user = results[0];

        if(user.password !== password) {
            return res.status(401).send('Email ou senha inválidos');
        }
        res.status(200).json({user_id: user.user_id, message: 'Login realizado com sucesso'});
    });
});


app.get('/first.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'first.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.post('/notes/create', (req, res) => {
    const {
        user_id,
        group_id,
        content = '', 
        color = '#ffff76ff', 
        position_x = 0, 
        position_y = 0
    } = req.body;

    if(!user_id || !group_id) {
        return res.status(400).send('Dados incompletos');
    }

    const sql = 'INSERT INTO note (user_id, group_id, content, color, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)';

    connection.query(sql, [user_id, group_id, content, color, position_x, position_y], (err, result) => {
        if(err) {
            console.error('Erro ao criar nota', err);
            return res.status(500).send('Erro interno ao criar nota');
        }
        console.log('Nota criada com sucesso. ID:', result.insertId);

        res.status(201).json({ note_id: result.insertId, message: 'Nota criada com sucesso'});
    });
});

app.post('/notes/update', (req, res) => {
    const {note_id, user_id, content, color, position_x, position_y} = req.body;

    if(!note_id || !user_id) {
        return res.status(400).send('Dados incompletos');
    }
    
    const updateContent = content !== undefined ? content: null;
    const updateColor = color !== undefined ? color: '#ffff76ff';
    const updateX = position_x !== undefined ? position_x: 0;
    const updateY = position_y !== undefined ? position_y: 0;

    const sql = 'UPDATE note SET content = ?, color = ?, position_x = ?, position_y = ? WHERE note_id = ? AND user_id = ?';

    connection.query(sql, [updateContent, updateColor, updateX, updateY, note_id, user_id], (err, result) => {
        if(err) {
            console.error('Erro ao atualizar nota', err);
            return res.status(500).send('Erro interno do servidor');
        }
        if(result.affectedRows === 0) {
            return res.status(404).send('nota não encontrada');
        }
        res.status(200).send('nota atualizada com sucesso');
    });
});

app.post('/notes/delete', (req, res) => {
    const { note_id, user_id} = req.body;

    if(!note_id || !user_id) {
        return res.status(400).send('Dados incompletos');
    }

    const sql = 'DELETE FROM note WHERE note_id = ? AND user_id = ?';
    connection.query(sql, [note_id, user_id], (err, result) => {
        if(err) {
            console.error('Erro ao deletar nota', err);
            return res.status(500).send('Erro interno do servidor');
        }
        if(result.affectedRows === 0) {
            return res.status(404).send('nota não encontrada');
        }
        res.status(200).send('nota deletada com sucesso');
    });
});

app.get('/notes/get/:group_id/:user_id', (req, res) => {
    const {group_id, user_id} = req.params;

    if(!group_id || !user_id) {
        return res.status(400).send('Dados incompletos');
    }

    const sql = 'SELECT * FROM note WHERE group_id = ? AND user_id = ? ORDER BY note_id DESC';

    connection.query(sql, [group_id, user_id], (err, results) => {
        if(err) {
            console.error('Erro ao buscar notas', err);
            return res.status(500).send('Erro interno do servidor');
        }
        
        res.status(200).json(results);
    });
});

app.post('/groups/create', (req, res) => {
    const {user_id, group_name} = req.body;

    if(!user_id || !group_name) {
        return res.status(400).send('Dados incompletos');
    }
    
    const sql = 'INSERT INTO note_group (user_id, group_name) VALUES (?, ?)';

    connection.query(sql, [user_id, group_name], (err, result) => {
        if(err) {
            console.error('Erro ao criar grupo', err);
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send('Você já tem um grupo com esse nome');
            }
            return res.status(500).send('Erro interno do servidor');
        }
        return res.status(201).json({ group_id: result.insertId, message: 'Grupo criado com sucesso'});
    });
});

app.get('/groups/get/:user_id', (req, res) => {
    const {user_id} = req.params;

    if(!user_id) {
        return res.status(400).send('ID do usuário é obrigatório');
    }

    const sql = 'SELECT group_id, group_name FROM note_group WHERE user_id = ? ORDER BY created_at DESC';

    connection.query(sql, [user_id], (err, result) => {
        if(err) {
            console.error('Erro ao buscar grupos', err);
            return res.status(500).send('Erro interno do servidor');
        }
        res.status(200).json(result);
    });
});