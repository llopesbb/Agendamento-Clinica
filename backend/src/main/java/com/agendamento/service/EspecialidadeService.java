package com.agendamento.service;

import com.agendamento.model.Especialidade;
import com.agendamento.repository.EspecialidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EspecialidadeService {

    @Autowired
    private EspecialidadeRepository repository;

    public List<Especialidade> listarTodas() {
        return repository.findAll();
    }

    public Especialidade salvar(Especialidade especialidade) {
        return repository.save(especialidade);
    }

    public Optional<Especialidade> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Especialidade editar(Integer id, Especialidade dados) {
        Especialidade esp = repository.findById(id).orElseThrow();
        esp.setNome(dados.getNome());
        return repository.save(esp);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
