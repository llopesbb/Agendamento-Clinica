import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>Clínica — Agendamento de Consultas</h1>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/consulta">Consultar meu agendamento</Link>
        <Link to="/login">Área ADM</Link>
      </nav>
    </header>
  );
}

export default Header;
