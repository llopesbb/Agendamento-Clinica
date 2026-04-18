import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const API = process.env.REACT_APP_API_URL || '/api';

function Agendamento() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const profissional = state?.profissional;

  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!profissional) {
      navigate('/');
      return;
    }
    fetch(`${API}/disponibilidade?profissionalId=${profissional.id}`)
      .then(r => r.json())
      .then(data => setHorarios(data));
  }, [profissional, navigate]);

  function confirmar() {
    setErro('');
    if (!horarioSelecionado) { setErro('Selecione um horário.'); return; }
    if (!nome.trim()) { setErro('Informe seu nome.'); return; }
    if (!cpf.trim()) { setErro('Informe seu CPF.'); return; }

    fetch(`${API}/agendamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomePaciente: nome,
        cpf: cpf,
        disponibilidadeId: horarioSelecionado.id
      })
    })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => setSucesso(true))
      .catch(() => setErro('Erro ao realizar agendamento. Tente novamente.'));
  }

  if (!profissional) return null;

  // Agrupa horários por data
  const porData = {};
  horarios.forEach(h => {
    const d = h.data;
    if (!porData[d]) porData[d] = [];
    porData[d].push(h);
  });

  return (
    <div>
      <Header />
      <div className="container">
        <h2 style={{ marginTop: '20px' }}>Agendar consulta</h2>
        <div className="card">
          <p><strong>Profissional:</strong> {profissional.nome}</p>
          <p><strong>Especialidade:</strong> {profissional.especialidade?.nome}</p>
        </div>

        {sucesso ? (
          <div className="mensagem-sucesso">
            Agendamento realizado com sucesso! Guarde seu CPF para consultar ou cancelar.
          </div>
        ) : (
          <>
            {erro && <div className="mensagem-erro">{erro}</div>}

            <h3>Selecione uma data e horário</h3>
            {Object.keys(porData).length === 0 && <p>Nenhum horário disponível para este profissional.</p>}
            {Object.keys(porData).sort().map(data => (
              <div key={data} style={{ marginBottom: '12px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>{data}</p>
                <div className="lista-horarios">
                  {porData[data].map(h => (
                    <div
                      key={h.id}
                      className={`horario-item ${horarioSelecionado?.id === h.id ? 'selecionado' : ''}`}
                      onClick={() => setHorarioSelecionado(h)}
                    >
                      {h.horario}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <h3 style={{ marginTop: '16px' }}>Seus dados</h3>
            <label>Nome completo</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João da Silva" />
            <label>CPF</label>
            <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="Ex: 000.000.000-00" />
            <button onClick={confirmar}>Confirmar agendamento</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Agendamento;
