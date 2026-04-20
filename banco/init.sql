CREATE DATABASE IF NOT EXISTS agendamento;
USE agendamento;

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL
);

INSERT INTO admin (usuario, senha) VALUES ('admin', 'admin123');

CREATE TABLE IF NOT EXISTS especialidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS profissionais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade_id INT,
    FOREIGN KEY (especialidade_id) REFERENCES especialidades(id)
);

CREATE TABLE IF NOT EXISTS disponibilidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profissional_id INT,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_paciente VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    disponibilidade_id INT,
    FOREIGN KEY (disponibilidade_id) REFERENCES disponibilidade(id)
);

CREATE INDEX IF NOT EXISTS idx_disponibilidade_prof_disp ON disponibilidade(profissional_id, disponivel);
CREATE INDEX IF NOT EXISTS idx_agendamentos_cpf ON agendamentos(cpf);
