package com.agendamento.service;

import com.agendamento.model.Agendamento;
import com.agendamento.model.Disponibilidade;
import com.agendamento.repository.AgendamentoRepository;
import com.agendamento.repository.DisponibilidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private DisponibilidadeRepository disponibilidadeRepository;

    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public List<Agendamento> buscarPorCpf(String cpf) {
        return agendamentoRepository.findByCpf(cpf);
    }

    public Agendamento criar(Map<String, Object> dados) {
        String nome = (String) dados.get("nomePaciente");
        String cpf = (String) dados.get("cpf");
        Integer disponibilidadeId = (Integer) dados.get("disponibilidadeId");

        Disponibilidade disp = disponibilidadeRepository.findById(disponibilidadeId).orElseThrow();
        disp.setDisponivel(false);
        disponibilidadeRepository.save(disp);

        Agendamento ag = new Agendamento();
        ag.setNomePaciente(nome);
        ag.setCpf(cpf);
        ag.setDisponibilidade(disp);
        return agendamentoRepository.save(ag);
    }

    public void cancelar(Integer id) {
        Agendamento ag = agendamentoRepository.findById(id).orElseThrow();
        // libera o horário
        Disponibilidade disp = ag.getDisponibilidade();
        disp.setDisponivel(true);
        disponibilidadeRepository.save(disp);
        agendamentoRepository.deleteById(id);
    }

    // Edita agendamento: libera horário antigo e ocupa o novo
    public Agendamento editar(Integer id, Map<String, Object> dados) {
        Agendamento ag = agendamentoRepository.findById(id).orElseThrow();

        // libera o horário antigo
        Disponibilidade dispAntiga = ag.getDisponibilidade();
        dispAntiga.setDisponivel(true);
        disponibilidadeRepository.save(dispAntiga);

        // ocupa o novo horário
        Integer novaDispId = (Integer) dados.get("disponibilidadeId");
        Disponibilidade novaDisp = disponibilidadeRepository.findById(novaDispId).orElseThrow();
        novaDisp.setDisponivel(false);
        disponibilidadeRepository.save(novaDisp);

        ag.setDisponibilidade(novaDisp);
        return agendamentoRepository.save(ag);
    }
}
