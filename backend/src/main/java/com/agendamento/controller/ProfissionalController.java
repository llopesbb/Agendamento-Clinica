package com.agendamento.controller;

import com.agendamento.model.Profissional;
import com.agendamento.service.ProfissionalService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {

    @Autowired
    private ProfissionalService service;

    @GetMapping
    public List<Profissional> listar(@RequestParam(required = false) Integer especialidadeId) {
        if (especialidadeId != null) {
            return service.listarPorEspecialidade(especialidadeId);
        }
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> dados, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        return ResponseEntity.ok(service.salvar(dados));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id, @RequestBody Map<String, Object> dados, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        return ResponseEntity.ok(service.editar(id, dados));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Integer id, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        service.excluir(id);
        return ResponseEntity.ok(Map.of("mensagem", "Profissional excluído"));
    }

    private boolean isAdmin(HttpSession session) {
        return Boolean.TRUE.equals(session.getAttribute("adminLogado"));
    }
}
