package com.agendamento.service;

import com.agendamento.model.Especialidade;
import com.agendamento.model.Profissional;
import com.agendamento.repository.EspecialidadeRepository;
import com.agendamento.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ProfissionalService {

    @Autowired
    private ProfissionalRepository repository;

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    public List<Profissional> listarTodos() {
        return repository.findAll();
    }

    public List<Profissional> listarPorEspecialidade(Integer especialidadeId) {
        return repository.findByEspecialidadeId(especialidadeId);
    }

    public Profissional salvar(Map<String, Object> dados) {
        Profissional p = new Profissional();
        p.setNome((String) dados.get("nome"));
        Integer espId = (Integer) dados.get("especialidadeId");
        Especialidade esp = especialidadeRepository.findById(espId).orElseThrow();
        p.setEspecialidade(esp);
        return repository.save(p);
    }

    public Profissional editar(Integer id, Map<String, Object> dados) {
        Profissional p = repository.findById(id).orElseThrow();
        p.setNome((String) dados.get("nome"));
        Integer espId = (Integer) dados.get("especialidadeId");
        Especialidade esp = especialidadeRepository.findById(espId).orElseThrow();
        p.setEspecialidade(esp);
        return repository.save(p);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
