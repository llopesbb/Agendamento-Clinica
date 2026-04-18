package com.agendamento.controller;

import com.agendamento.model.Admin;
import com.agendamento.repository.AdminRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
public class LoginController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados, HttpSession session) {
        String usuario = dados.get("usuario");
        String senha = dados.get("senha");
        Optional<Admin> admin = adminRepository.findByUsuarioAndSenha(usuario, senha);
        if (admin.isPresent()) {
            session.setAttribute("adminLogado", true);
            return ResponseEntity.ok(Map.of("mensagem", "Login realizado com sucesso"));
        }
        return ResponseEntity.status(401).body(Map.of("erro", "Usuário ou senha inválidos"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("mensagem", "Logout realizado"));
    }

    @GetMapping("/sessao")
    public ResponseEntity<?> verificarSessao(HttpSession session) {
        Boolean logado = (Boolean) session.getAttribute("adminLogado");
        if (Boolean.TRUE.equals(logado)) {
            return ResponseEntity.ok(Map.of("logado", true));
        }
        return ResponseEntity.status(401).body(Map.of("logado", false));
    }
}
