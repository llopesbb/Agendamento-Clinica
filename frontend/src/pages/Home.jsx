import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const API = process.env.REACT_APP_API_URL || '/api';

function Home() {
  const [especialidades, setEspecialidades] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [espSelecionada, setEspSelecionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/especialidades`)
      .then(r => r.json())
      .then(data => setEspecialidades(data));
  }, []);

  function selecionarEspecialidade(esp) {
    setEspSelecionada(esp);
    setProfissionais([]);
    fetch(`${API}/profissionais?especialidadeId=${esp.id}`)
      .then(r => r.json())
      .then(data => setProfissionais(data));
  }

  function irParaAgendamento(profissional) {
    navigate('/agendamento', { state: { profissional } });
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h2 style={{ marginTop: '20px' }}>Especialidades disponíveis</h2>
        {especialidades.length === 0 && <p>Nenhuma especialidade cadastrada.</p>}
        {especialidades.map(esp => (
          <div
            key={esp.id}
            className={`especialidade-item ${espSelecionada && espSelecionada.id === esp.id ? 'selecionada' : ''}`}
            onClick={() => selecionarEspecialidade(esp)}
          >
            {esp.nome}
          </div>
        ))}

        {espSelecionada && (
          <div style={{ marginTop: '20px' }}>
            <h2>Profissionais — {espSelecionada.nome}</h2>
            {profissionais.length === 0 && <p>Nenhum profissional disponível.</p>}
            {profissionais.map(p => (
              <div key={p.id} className="profissional-item">
                <strong>{p.nome}</strong>
                <button
                  style={{ marginLeft: '16px', padding: '6px 12px' }}
                  onClick={() => irParaAgendamento(p)}
                >
                  Agendar consulta
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
