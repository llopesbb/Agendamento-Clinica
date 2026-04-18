package com.agendamento.service;

import com.agendamento.model.Disponibilidade;
import com.agendamento.model.Profissional;
import com.agendamento.repository.DisponibilidadeRepository;
import com.agendamento.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DisponibilidadeService {

    @Autowired
    private DisponibilidadeRepository repository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    public List<Disponibilidade> listarDisponiveisPorProfissional(Integer profissionalId) {
        return repository.findByProfissionalIdAndDisponivelTrue(profissionalId);
    }

    public List<Disponibilidade> listarTodosPorProfissional(Integer profissionalId) {
        return repository.findByProfissionalId(profissionalId);
    }

    // Gera todos os horários dentro da janela com o intervalo informado
    public List<Disponibilidade> gerarHorarios(Map<String, Object> dados) {
        Integer profissionalId = (Integer) dados.get("profissionalId");
        String dataStr = (String) dados.get("data");
        String horaInicio = (String) dados.get("horaInicio");
        String horaFim = (String) dados.get("horaFim");
        Integer duracao = (Integer) dados.get("duracao");

        Profissional profissional = profissionalRepository.findById(profissionalId).orElseThrow();
        LocalDate data = LocalDate.parse(dataStr);
        LocalTime inicio = LocalTime.parse(horaInicio);
        LocalTime fim = LocalTime.parse(horaFim);

        List<Disponibilidade> gerados = new ArrayList<>();
        LocalTime atual = inicio;

        while (!atual.isAfter(fim.minusMinutes(duracao))) {
            Disponibilidade d = new Disponibilidade();
            d.setProfissional(profissional);
            d.setData(data);
            d.setHorario(atual);
            d.setDisponivel(true);
            gerados.add(repository.save(d));
            atual = atual.plusMinutes(duracao);
        }

        return gerados;
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
