package com.agendamento.repository;

import com.agendamento.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProfissionalRepository extends JpaRepository<Profissional, Integer> {
    List<Profissional> findByEspecialidadeId(Integer especialidadeId);
}
