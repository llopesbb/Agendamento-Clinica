import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || '/api';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  function entrar(e) {
    e.preventDefault();
    setErro('');
    fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ usuario, senha })
    })
      .then(r => {
        if (r.ok) {
          navigate('/painel');
        } else {
          setErro('Usuário ou senha inválidos.');
        }
      });
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '6px', border: '1px solid #ddd', width: '320px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Área Administrativa</h2>
        {erro && <div className="mensagem-erro">{erro}</div>}
        <form onSubmit={entrar}>
          <label>Usuário</label>
          <input value={usuario} onChange={e => setUsuario(e.target.value)} required />
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
          <button type="submit" style={{ width: '100%', marginTop: '8px' }}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
