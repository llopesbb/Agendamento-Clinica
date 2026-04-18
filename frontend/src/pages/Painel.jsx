import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || '/api';

function Painel() {
  const navigate = useNavigate();
  const [aba, setAba] = useState('especialidades');

  // ---------- estado especialidades ----------
  const [especialidades, setEspecialidades] = useState([]);
  const [nomeEsp, setNomeEsp] = useState('');
  const [editandoEsp, setEditandoEsp] = useState(null);

  // ---------- estado profissionais ----------
  const [profissionais, setProfissionais] = useState([]);
  const [nomePro, setNomePro] = useState('');
  const [espIdPro, setEspIdPro] = useState('');
  const [editandoPro, setEditandoPro] = useState(null);

  // ---------- estado disponibilidade ----------
  const [dispProfId, setDispProfId] = useState('');
  const [dispData, setDispData] = useState('');
  const [dispInicio, setDispInicio] = useState('');
  const [dispFim, setDispFim] = useState('');
  const [dispDuracao, setDispDuracao] = useState('');
  const [horariosProf, setHorariosProf] = useState([]);
  const [profFiltro, setProfFiltro] = useState('');

  // ---------- estado agendamentos ----------
  const [agendamentos, setAgendamentos] = useState([]);
  const [editandoAg, setEditandoAg] = useState(null);
  const [agEspId, setAgEspId] = useState('');
  const [agProfId, setAgProfId] = useState('');
  const [agDispId, setAgDispId] = useState('');
  const [agProfissionais, setAgProfissionais] = useState([]);
  const [agHorarios, setAgHorarios] = useState([]);

  // Verifica sessão ao entrar
  useEffect(() => {
    fetch(`${API}/sessao`, { credentials: 'include' })
      .then(r => {
        if (!r.ok) navigate('/login');
      });
  }, [navigate]);

  // Carrega dados iniciais
  useEffect(() => {
    carregarEspecialidades();
    carregarProfissionais();
    carregarAgendamentos();
  }, []);

  function carregarEspecialidades() {
    fetch(`${API}/especialidades`, { credentials: 'include' })
      .then(r => r.json()).then(setEspecialidades);
  }

  function carregarProfissionais() {
    fetch(`${API}/profissionais`, { credentials: 'include' })
      .then(r => r.json()).then(setProfissionais);
  }

  function carregarAgendamentos() {
    fetch(`${API}/agendamento`, { credentials: 'include' })
      .then(r => r.json()).then(data => {
        if (Array.isArray(data)) setAgendamentos(data);
      });
  }

  function carregarHorariosProfissional(profId) {
    if (!profId) return;
    fetch(`${API}/disponibilidade/todos?profissionalId=${profId}`, { credentials: 'include' })
      .then(r => r.json()).then(setHorariosProf);
  }

  function sair() {
    fetch(`${API}/logout`, { method: 'POST', credentials: 'include' })
      .then(() => navigate('/login'));
  }

  // ---- Especialidades ----

  function salvarEspecialidade() {
    if (!nomeEsp.trim()) return;
    if (editandoEsp) {
      fetch(`${API}/especialidades/${editandoEsp.id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeEsp })
      }).then(() => { setEditandoEsp(null); setNomeEsp(''); carregarEspecialidades(); });
    } else {
      fetch(`${API}/especialidades`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeEsp })
      }).then(() => { setNomeEsp(''); carregarEspecialidades(); });
    }
  }

  function excluirEspecialidade(id) {
    if (!window.confirm('Excluir especialidade?')) return;
    fetch(`${API}/especialidades/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(() => carregarEspecialidades());
  }

  // ---- Profissionais ----

  function salvarProfissional() {
    if (!nomePro.trim() || !espIdPro) return;
    const dados = { nome: nomePro, especialidadeId: parseInt(espIdPro) };
    if (editandoPro) {
      fetch(`${API}/profissionais/${editandoPro.id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      }).then(() => { setEditandoPro(null); setNomePro(''); setEspIdPro(''); carregarProfissionais(); });
    } else {
      fetch(`${API}/profissionais`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      }).then(() => { setNomePro(''); setEspIdPro(''); carregarProfissionais(); });
    }
  }

  function excluirProfissional(id) {
    if (!window.confirm('Excluir profissional?')) return;
    fetch(`${API}/profissionais/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(() => carregarProfissionais());
  }

  // ---- Disponibilidade ----

  function gerarHorarios() {
    if (!dispProfId || !dispData || !dispInicio || !dispFim || !dispDuracao) return;
    fetch(`${API}/disponibilidade/gerar`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profissionalId: parseInt(dispProfId),
        data: dispData,
        horaInicio: dispInicio,
        horaFim: dispFim,
        duracao: parseInt(dispDuracao)
      })
    }).then(() => {
      setDispData(''); setDispInicio(''); setDispFim(''); setDispDuracao('');
      if (profFiltro) carregarHorariosProfissional(profFiltro);
    });
  }

  function excluirHorario(id) {
    if (!window.confirm('Excluir horário?')) return;
    fetch(`${API}/disponibilidade/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(() => carregarHorariosProfissional(profFiltro));
  }

  // ---- Agendamentos ----

  function cancelarAgendamento(id) {
    if (!window.confirm('Cancelar agendamento?')) return;
    fetch(`${API}/agendamento/admin/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(() => carregarAgendamentos());
  }

  function iniciarEdicaoAg(ag) {
    setEditandoAg(ag);
    setAgEspId(ag.disponibilidade?.profissional?.especialidade?.id || '');
    setAgProfId(ag.disponibilidade?.profissional?.id || '');
    setAgDispId(ag.disponibilidade?.id || '');
    // carrega profissionais da especialidade
    const espId = ag.disponibilidade?.profissional?.especialidade?.id;
    if (espId) {
      fetch(`${API}/profissionais?especialidadeId=${espId}`, { credentials: 'include' })
        .then(r => r.json()).then(setAgProfissionais);
    }
    // carrega horários do profissional
    const profId = ag.disponibilidade?.profissional?.id;
    if (profId) {
      fetch(`${API}/disponibilidade?profissionalId=${profId}`, { credentials: 'include' })
        .then(r => r.json()).then(setAgHorarios);
    }
  }

  function aoMudarEspAg(espId) {
    setAgEspId(espId);
    setAgProfId('');
    setAgDispId('');
    setAgHorarios([]);
    fetch(`${API}/profissionais?especialidadeId=${espId}`, { credentials: 'include' })
      .then(r => r.json()).then(setAgProfissionais);
  }

  function aoMudarProfAg(profId) {
    setAgProfId(profId);
    setAgDispId('');
    fetch(`${API}/disponibilidade?profissionalId=${profId}`, { credentials: 'include' })
      .then(r => r.json()).then(setAgHorarios);
  }

  function salvarEdicaoAg() {
    if (!agDispId) return;
    fetch(`${API}/agendamento/admin/${editandoAg.id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponibilidadeId: parseInt(agDispId) })
    }).then(() => { setEditandoAg(null); carregarAgendamentos(); });
  }

  return (
    <div>
      <div style={{ background: '#2c6fad', color: 'white', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Painel Administrativo</span>
        <button onClick={sair} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white' }}>Sair</button>
      </div>

      <div className="container" style={{ marginTop: '20px' }}>
        <div className="abas">
          {['especialidades', 'profissionais', 'disponibilidade', 'agendamentos'].map(a => (
            <button key={a} className={aba === a ? 'ativa' : ''} onClick={() => setAba(a)}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>

        {/* ========================= ESPECIALIDADES ========================= */}
        {aba === 'especialidades' && (
          <div>
            <h2>Especialidades</h2>
            <div className="form-inline">
              <input
                value={nomeEsp}
                onChange={e => setNomeEsp(e.target.value)}
                placeholder="Nome da especialidade"
              />
              <button onClick={salvarEspecialidade}>{editandoEsp ? 'Salvar' : 'Adicionar'}</button>
              {editandoEsp && (
                <button onClick={() => { setEditandoEsp(null); setNomeEsp(''); }}
                  style={{ background: '#999' }}>
                  Cancelar
                </button>
              )}
            </div>
            <table>
              <thead>
                <tr><th>Nome</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {especialidades.map(e => (
                  <tr key={e.id}>
                    <td>{e.nome}</td>
                    <td>
                      <button className="btn-editar" style={{ marginRight: '8px' }} onClick={() => { setEditandoEsp(e); setNomeEsp(e.nome); }}>Editar</button>
                      <button className="btn-cancelar" onClick={() => excluirEspecialidade(e.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================= PROFISSIONAIS ========================= */}
        {aba === 'profissionais' && (
          <div>
            <h2>Profissionais</h2>
            <div className="form-inline">
              <input
                value={nomePro}
                onChange={e => setNomePro(e.target.value)}
                placeholder="Nome do profissional"
              />
              <select value={espIdPro} onChange={e => setEspIdPro(e.target.value)}>
                <option value="">Especialidade</option>
                {especialidades.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
              <button onClick={salvarProfissional}>{editandoPro ? 'Salvar' : 'Adicionar'}</button>
              {editandoPro && (
                <button onClick={() => { setEditandoPro(null); setNomePro(''); setEspIdPro(''); }}
                  style={{ background: '#999' }}>
                  Cancelar
                </button>
              )}
            </div>
            <table>
              <thead>
                <tr><th>Nome</th><th>Especialidade</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {profissionais.map(p => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.especialidade?.nome}</td>
                    <td>
                      <button className="btn-editar" style={{ marginRight: '8px' }} onClick={() => {
                        setEditandoPro(p);
                        setNomePro(p.nome);
                        setEspIdPro(p.especialidade?.id || '');
                      }}>Editar</button>
                      <button className="btn-cancelar" onClick={() => excluirProfissional(p.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================= DISPONIBILIDADE ========================= */}
        {aba === 'disponibilidade' && (
          <div>
            <h2>Disponibilidade</h2>
            <div className="card">
              <h3>Gerar horários</h3>
              <label>Profissional</label>
              <select value={dispProfId} onChange={e => setDispProfId(e.target.value)}>
                <option value="">Selecione</option>
                {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <label>Data</label>
              <input type="date" value={dispData} onChange={e => setDispData(e.target.value)} />
              <label>Horário de início</label>
              <input type="time" value={dispInicio} onChange={e => setDispInicio(e.target.value)} />
              <label>Horário de fim</label>
              <input type="time" value={dispFim} onChange={e => setDispFim(e.target.value)} />
              <label>Duração de cada atendimento (minutos)</label>
              <input type="number" value={dispDuracao} onChange={e => setDispDuracao(e.target.value)} placeholder="Ex: 30" />
              <button onClick={gerarHorarios}>Gerar horários</button>
            </div>

            <h3 style={{ marginTop: '20px' }}>Horários cadastrados</h3>
            <div className="form-inline">
              <select value={profFiltro} onChange={e => { setProfFiltro(e.target.value); carregarHorariosProfissional(e.target.value); }}>
                <option value="">Selecione um profissional</option>
                {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            {horariosProf.length > 0 && (
              <table>
                <thead>
                  <tr><th>Data</th><th>Horário</th><th>Disponível</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {horariosProf.map(h => (
                    <tr key={h.id}>
                      <td>{h.data}</td>
                      <td>{h.horario}</td>
                      <td>{h.disponivel ? 'Sim' : 'Não'}</td>
                      <td>
                        <button className="btn-cancelar" onClick={() => excluirHorario(h.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ========================= AGENDAMENTOS ========================= */}
        {aba === 'agendamentos' && (
          <div>
            <h2>Agendamentos</h2>

            {editandoAg && (
              <div className="card">
                <h3>Editar agendamento — {editandoAg.nomePaciente}</h3>
                <label>Especialidade</label>
                <select value={agEspId} onChange={e => aoMudarEspAg(e.target.value)}>
                  <option value="">Selecione</option>
                  {especialidades.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
                <label>Profissional</label>
                <select value={agProfId} onChange={e => aoMudarProfAg(e.target.value)}>
                  <option value="">Selecione</option>
                  {agProfissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <label>Horário disponível</label>
                <select value={agDispId} onChange={e => setAgDispId(e.target.value)}>
                  <option value="">Selecione</option>
                  {agHorarios.map(h => (
                    <option key={h.id} value={h.id}>{h.data} — {h.horario}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={salvarEdicaoAg}>Salvar</button>
                  <button onClick={() => setEditandoAg(null)} style={{ background: '#999' }}>Cancelar</button>
                </div>
              </div>
            )}

            <table>
              <thead>
                <tr>
                  <th>Paciente</th><th>CPF</th><th>Profissional</th>
                  <th>Especialidade</th><th>Data</th><th>Horário</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map(ag => (
                  <tr key={ag.id}>
                    <td>{ag.nomePaciente}</td>
                    <td>{ag.cpf}</td>
                    <td>{ag.disponibilidade?.profissional?.nome}</td>
                    <td>{ag.disponibilidade?.profissional?.especialidade?.nome}</td>
                    <td>{ag.disponibilidade?.data}</td>
                    <td>{ag.disponibilidade?.horario}</td>
                    <td>
                      <button className="btn-editar" style={{ marginRight: '8px' }} onClick={() => iniciarEdicaoAg(ag)}>Editar</button>
                      <button className="btn-cancelar" onClick={() => cancelarAgendamento(ag.id)}>Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Painel;
