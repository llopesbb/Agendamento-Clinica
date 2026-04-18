package com.agendamento.controller;

import com.agendamento.model.Disponibilidade;
import com.agendamento.service.DisponibilidadeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/disponibilidade")
public class DisponibilidadeController {

    @Autowired
    private DisponibilidadeService service;

    @GetMapping
    public List<Disponibilidade> listar(@RequestParam Integer profissionalId) {
        return service.listarDisponiveisPorProfissional(profissionalId);
    }

    @GetMapping("/todos")
    public ResponseEntity<?> listarTodos(@RequestParam Integer profissionalId, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        return ResponseEntity.ok(service.listarTodosPorProfissional(profissionalId));
    }

    @PostMapping("/gerar")
    public ResponseEntity<?> gerar(@RequestBody Map<String, Object> dados, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        List<Disponibilidade> gerados = service.gerarHorarios(dados);
        return ResponseEntity.ok(gerados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Integer id, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        service.excluir(id);
        return ResponseEntity.ok(Map.of("mensagem", "Horário excluído"));
    }

    private boolean isAdmin(HttpSession session) {
        return Boolean.TRUE.equals(session.getAttribute("adminLogado"));
    }
}
