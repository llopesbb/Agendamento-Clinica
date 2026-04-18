package com.agendamento.controller;

import com.agendamento.model.Especialidade;
import com.agendamento.service.EspecialidadeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/especialidades")
public class EspecialidadeController {

    @Autowired
    private EspecialidadeService service;

    @GetMapping
    public List<Especialidade> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Especialidade especialidade, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        return ResponseEntity.ok(service.salvar(especialidade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id, @RequestBody Especialidade dados, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        return ResponseEntity.ok(service.editar(id, dados));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Integer id, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(401).body("Não autorizado");
        service.excluir(id);
        return ResponseEntity.ok(Map.of("mensagem", "Especialidade excluída"));
    }

    private boolean isAdmin(HttpSession session) {
        return Boolean.TRUE.equals(session.getAttribute("adminLogado"));
    }
}
