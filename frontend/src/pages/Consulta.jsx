import React, { useState } from 'react';
import Header from '../components/Header';

const API = process.env.REACT_APP_API_URL || '/api';

function Consulta() {
  const [cpf, setCpf] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);
  const [buscou, setBuscou] = useState(false);
  const [mensagem, setMensagem] = useState('');

  function buscar() {
    setMensagem('');
    fetch(`${API}/agendamento/cpf/${cpf}`)
      .then(r => r.json())
      .then(data => {
        setAgendamentos(data);
        setBuscou(true);
      });
  }

  function cancelar(id) {
    if (!window.confirm('Deseja cancelar este agendamento?')) return;
    fetch(`${API}/agendamento/${id}`, { method: 'DELETE' })
      .then(r => {
        if (r.ok) {
          setAgendamentos(agendamentos.filter(a => a.id !== id));
          setMensagem('Agendamento cancelado com sucesso.');
        }
      });
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h2 style={{ marginTop: '20px' }}>Consultar meu agendamento</h2>
        <label>Digite seu CPF</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            value={cpf}
            onChange={e => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            style={{ flex: 1 }}
          />
          <button onClick={buscar}>Buscar</button>
        </div>

        {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

        {buscou && agendamentos.length === 0 && (
          <p>Nenhum agendamento encontrado para este CPF.</p>
        )}

        {agendamentos.map(ag => (
          <div key={ag.id} className="card">
            <p><strong>Paciente:</strong> {ag.nomePaciente}</p>
            <p><strong>Profissional:</strong> {ag.disponibilidade?.profissional?.nome}</p>
            <p><strong>Especialidade:</strong> {ag.disponibilidade?.profissional?.especialidade?.nome}</p>
            <p><strong>Data:</strong> {ag.disponibilidade?.data}</p>
            <p><strong>Horário:</strong> {ag.disponibilidade?.horario}</p>
            <button className="btn-cancelar" style={{ marginTop: '10px' }} onClick={() => cancelar(ag.id)}>
              Cancelar agendamento
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Consulta;
