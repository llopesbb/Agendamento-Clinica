package com.agendamento.repository;

import com.agendamento.model.Disponibilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Integer> {
    List<Disponibilidade> findByProfissionalIdAndDisponivelTrue(Integer profissionalId);
    List<Disponibilidade> findByProfissionalId(Integer profissionalId);
}
