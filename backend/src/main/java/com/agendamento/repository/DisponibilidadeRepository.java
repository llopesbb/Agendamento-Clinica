package com.agendamento.repository;

import com.agendamento.model.Disponibilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Integer> {

    @Query("SELECT d FROM Disponibilidade d JOIN FETCH d.profissional p JOIN FETCH p.especialidade WHERE p.id = :profissionalId AND d.disponivel = true")
    List<Disponibilidade> findByProfissionalIdAndDisponivelTrue(@Param("profissionalId") Integer profissionalId);

    @Query("SELECT d FROM Disponibilidade d JOIN FETCH d.profissional p JOIN FETCH p.especialidade WHERE p.id = :profissionalId")
    List<Disponibilidade> findByProfissionalId(@Param("profissionalId") Integer profissionalId);
}
