package com.project.tobe.controller;
import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import com.project.tobe.service.ConfirmService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/confirm")
@RequiredArgsConstructor
public class ConfirmController {
    private final ConfirmService confirmService;

    @PostMapping
    public ResponseEntity<Confirm> saveConfirm(@RequestBody Confirm confirm) {
        return ResponseEntity.ok(confirmService.saveConfirm(confirm));
    }

    @GetMapping
    public ResponseEntity<List<Confirm>> findAllConfirms() {
        return ResponseEntity.ok(confirmService.findAllConfirms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Confirm> getConfirmById(@PathVariable Long id) {
        return ResponseEntity.ok(confirmService.getConfirmById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Confirm> updateConfirm(@PathVariable Long id, @RequestBody Confirm confirmDetails) {
        Confirm updatedConfirm = confirmService.updateConfirm(id, confirmDetails);
        return ResponseEntity.ok(updatedConfirm);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Confirm>> searchConfirms(
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String employeeName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate confirmRegDate,
            @RequestParam(required = false) String confirmStatus) {
        List<Confirm> results = confirmService.searchConfirms(customerName, employeeName, confirmRegDate, confirmStatus);
        return ResponseEntity.ok(results);
    }

}
