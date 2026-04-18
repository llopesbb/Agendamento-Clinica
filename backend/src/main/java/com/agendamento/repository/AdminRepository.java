package com.agendamento.repository;

import com.agendamento.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByUsuarioAndSenha(String usuario, String senha);
}
