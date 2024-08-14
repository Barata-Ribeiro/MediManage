package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.dtos.requests.ConsultationRegisterDTO;
import com.barataribeiro.medimanage.dtos.requests.ConsultationUpdateDTO;
import com.barataribeiro.medimanage.services.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/consultations")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ConsultationController {
    private final ConsultationService consultationService;

    @GetMapping
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO> getConsultationsPaginated(@RequestParam(required = false) String search,
                                                                     @RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int perPage,
                                                                     @RequestParam(defaultValue = "ASC")
                                                                     String direction,
                                                                     @RequestParam(defaultValue = "createdAt")
                                                                     String orderBy,
                                                                     Principal principal) {
        Page<ConsultationDTO> response = consultationService.getConsultationsPaginated(search, page, perPage,
                direction, orderBy,
                principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                "Consultation(s) retrieved successfully.",
                response));
    }

    @GetMapping("/patient/{patientId}")
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO> getConsultationsByPatientId(@PathVariable String patientId,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int perPage,
                                                                       @RequestParam(defaultValue = "ASC")
                                                                       String direction,
                                                                       @RequestParam(defaultValue = "createdAt")
                                                                       String orderBy,
                                                                       Principal principal) {
        Page<ConsultationDTO> response = consultationService.getPatientConsultationsPaginatedList(patientId, page,
                perPage,
                direction, orderBy,
                principal);
        String username = response.getContent().getFirst().getPatient().getUsername();
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                "Consultation(s) retrieved successfully for " + username + ".",
                response));
    }

    @PostMapping
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO> registerNewConsultationForPatient(
            @RequestBody @Valid ConsultationRegisterDTO body,
            Principal principal) {
        ConsultationDTO response = consultationService.registerNewConsultationForPatient(body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.CREATED,
                HttpStatus.CREATED.value(),
                "Consultation created successfully.",
                response));
    }

    @GetMapping("/{consultationId}")
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO> getConsultation(@PathVariable String consultationId, Principal principal) {
        ConsultationDTO response = consultationService.getConsultation(consultationId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                "Consultation retrieved successfully.",
                response));
    }

    @PutMapping("/{consultationId}")
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO> updateConsultation(@PathVariable String consultationId,
                                                              @RequestBody @Valid ConsultationUpdateDTO body,
                                                              Principal principal) {
        ConsultationDTO response = consultationService.updateConsultation(consultationId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                "Consultation status updated successfully.",
                response));
    }

}
