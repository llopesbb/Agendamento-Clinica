package com.agendamento.controller;

import com.agendamento.model.Agendamento;
import com.agendamento.service.AgendamentoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/agendamento")
public class AgendamentoController {

    @Autowired
    private AgendamentoService service;

    // ADM: lista todos
    @GetMapping
    public ResponseEntity<?> listarTodos(HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        return ResponseEntity.ok(service.listarTodos());
    }

    // Público: busca por CPF
    @GetMapping("/cpf/{cpf}")
    public List<Agendamento> buscarPorCpf(@PathVariable String cpf) {
        return service.buscarPorCpf(cpf);
    }

    // Público: cria agendamento
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> dados) {
        Agendamento ag = service.criar(dados);
        return ResponseEntity.ok(ag);
    }

    // Público: cancela agendamento
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Integer id) {
        service.cancelar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Agendamento cancelado"));
    }

    // ADM: edita agendamento
    @PutMapping("/admin/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id, @RequestBody Map<String, Object> dados, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        return ResponseEntity.ok(service.editar(id, dados));
    }

    // ADM: cancela agendamento
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> cancelarAdmin(@PathVariable Integer id, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        service.cancelar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Agendamento cancelado pelo admin"));
    }

    private boolean isAdmin(HttpSession session) {
        return Boolean.TRUE.equals(session.getAttribute("adminLogado"));
    }
}
