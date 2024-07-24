package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.MedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.dtos.requests.MedicalRecordRegisterDTO;
import com.barataribeiro.medimanage.services.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;

    @PostMapping
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO> registerMedicalRecord(@RequestBody @Valid MedicalRecordRegisterDTO body,
                                                                 Principal principal) {
        MedicalRecordDTO response = medicalRecordService.registerMedicalRecord(principal, body);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.CREATED,
                                                     HttpStatus.CREATED.value(),
                                                     "Medical record registered successfully.",
                                                     response));
    }
}
