package com.agendamento.repository;

import com.agendamento.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {

    @Query("SELECT a FROM Agendamento a JOIN FETCH a.disponibilidade d JOIN FETCH d.profissional p JOIN FETCH p.especialidade")
    List<Agendamento> findAllWithDetails();

    @Query("SELECT a FROM Agendamento a JOIN FETCH a.disponibilidade d JOIN FETCH d.profissional p JOIN FETCH p.especialidade WHERE a.cpf = :cpf")
    List<Agendamento> findByCpf(@Param("cpf") String cpf);
}
