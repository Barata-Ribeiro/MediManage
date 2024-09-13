package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.MedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleMedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.requests.MedicalRecordRegisterDTO;
import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import com.barataribeiro.medimanage.services.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;

    @Operation(summary = "Get medical records paginated",
               description = "Get a paginated list of medical records. The list can be filtered by search, ordered by" +
                             " " +
                             "createdAt or updatedAt, and ordered in ASC or DESC order.",
               tags = {"records"})
    @GetMapping
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO<Page<SimpleMedicalRecordDTO>>> getMedicalRecordsPaginated(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC")
            String direction,
            @RequestParam(defaultValue = "createdAt")
            String orderBy,
            Principal principal) {

        Page<SimpleMedicalRecordDTO> response = medicalRecordService
                .getMedicalRecordsPaginated(search, page, perPage, direction, orderBy, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Medical record(s) retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Get medical record",
               description = "Get a specific medical record.",
               tags = {"records"})
    @GetMapping("/{recordId}")
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO<MedicalRecordDTO>> getMedicalRecord(@PathVariable String recordId,
                                                                              Principal principal) {
        MedicalRecordDTO response = medicalRecordService.getMedicalRecord(recordId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Medical record retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Register medical record",
               description = "Register a new medical record.",
               tags = {"records"})
    @PostMapping
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO<MedicalRecordDTO>> registerMedicalRecord(
            @RequestBody @Valid MedicalRecordRegisterDTO body,
            Principal principal) {
        MedicalRecordDTO response = medicalRecordService.registerMedicalRecord(principal, body);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Medical record registered successfully.",
                                                       response));
    }

    @Operation(summary = "Update medical record",
               description = "Update a specific medical record.",
               tags = {"records"})
    @PutMapping("/{recordId}")
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public ResponseEntity<RestResponseDTO<MedicalRecordDTO>> updateMedicalRecord(@PathVariable String recordId,
                                                                                 @RequestBody @Valid
                                                                                 MedicalRecordRegisterDTO body,
                                                                                 Principal principal) {
        MedicalRecordDTO response = medicalRecordService.updateMedicalRecord(principal, body, recordId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Medical record updated successfully.",
                                                       response));
    }
}
