const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

let alunos = [];

app.get('/alunos', (req, res) => {
    res.json(alunos);
});

app.post('/alunos', (req, res) => {
    const { matricula, nome, email, dataNascimento } = req.body;

    const alunoExistente = alunos.find(aluno => aluno.matricula === matricula);
    if (alunoExistente) {
        return res.status(400).json({ mensagem: 'Matrícula já cadastrada.' });
    }

    const novoAluno = { matricula, nome, email, dataNascimento };
    alunos.push(novoAluno);
    res.status(201).json(novoAluno);
});

app.put('/alunos/:matricula', (req, res) => {
    const matricula = req.params.matricula;
    const { nome, email, dataNascimento } = req.body;

    const alunoIndex = alunos.findIndex(aluno => aluno.matricula === matricula);
    if (alunoIndex === -1) {
        return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }

    if (req.body.matricula && req.body.matricula !== matricula) {
        const alunoExistente = alunos.find(aluno => aluno.matricula === req.body.matricula);
        if (alunoExistente) {
            return res.status(400).json({ mensagem: 'Matrícula já cadastrada.' });
        }
    }

    alunos[alunoIndex] = { matricula, nome, email, dataNascimento };
    res.json(alunos[alunoIndex]);
});

app.delete('/alunos/:matricula', (req, res) => {
    const matricula = req.params.matricula;
    const alunoIndex = alunos.findIndex(aluno => aluno.matricula === matricula);
    
    if (alunoIndex === -1) {
        return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
    }

    alunos.splice(alunoIndex, 1);
    res.status(204).send(); 
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
