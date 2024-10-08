package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.PrescriptionDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimplePrescriptionDTO;
import com.barataribeiro.medimanage.dtos.requests.PrescriptionCreateDTO;
import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import com.barataribeiro.medimanage.services.PrescriptionService;
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
@RequestMapping("/api/v1/prescriptions")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    @Operation(summary = "Get patient prescriptions paginated list",
               description = "Get a paginated list of prescriptions for a specific patient. The list can be ordered " +
                             "by createdAt or updatedAt, and ordered in ASC or DESC order.",
               tags = {"prescriptions"})
    @GetMapping("/patients/{patientId}")
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO<Page<SimplePrescriptionDTO>>> getPatientPrescriptionsPaginatedList(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Principal principal) {

        Page<SimplePrescriptionDTO> response = prescriptionService
                .getPatientPrescriptionsPaginatedList(patientId, page, perPage, direction, orderBy, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Prescriptions retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Get prescription",
               description = "Get a specific prescription.",
               tags = {"prescriptions"})
    @GetMapping("/{prescriptionId}")
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO<PrescriptionDTO>> getPrescription(@PathVariable String prescriptionId,
                                                                            @RequestParam String username,
                                                                            Principal principal) {
        PrescriptionDTO response = prescriptionService.getPrescription(username, prescriptionId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Prescription retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Create prescription",
               description = "Create a prescription for a specific patient.",
               tags = {"prescriptions"})
    @PostMapping("/patients/{patientId}")
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public ResponseEntity<RestResponseDTO<PrescriptionDTO>> createPrescription(@PathVariable String patientId,
                                                                               @RequestBody @Valid
                                                                               PrescriptionCreateDTO body,
                                                                               Principal principal) {
        PrescriptionDTO response = prescriptionService.createPrescription(patientId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Prescription created successfully.",
                                                       response));
    }

    @Operation(summary = "Update prescription",
               description = "Update a specific prescription.",
               tags = {"prescriptions"})
    @PatchMapping("/patients/{patientUsername}/{prescriptionId}")
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public ResponseEntity<RestResponseDTO<PrescriptionDTO>> updatePrescription(@PathVariable String patientUsername,
                                                                               @PathVariable String prescriptionId,
                                                                               @RequestBody @Valid
                                                                               PrescriptionCreateDTO body,
                                                                               Principal principal) {
        PrescriptionDTO response = prescriptionService.updatePrescription(patientUsername, prescriptionId, body,
                                                                          principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Prescription updated successfully.",
                                                       response));
    }

    @Operation(summary = "Get requesting user's prescriptions paginated list",
               description = "Get a paginated list of prescriptions for the authenticated patient. The list can be " +
                             "ordered by createdAt or updatedAt, and ordered in ASC or DESC order. The user is " +
                             "allowed to search either by the prescription's text or the doctor's name.",
               tags = {"prescriptions"})
    @GetMapping("/me")
    @Secured({"ACCOUNT_TYPE_PATIENT"})
    public ResponseEntity<RestResponseDTO<Page<SimplePrescriptionDTO>>> getMyPrescriptionsPaginatedList(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Principal principal) {

        Page<SimplePrescriptionDTO> response = prescriptionService
                .getMyPrescriptionsPaginatedList(search, page, perPage, direction, orderBy, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Prescriptions retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Get requesting user's prescription by id",
               description = "Get a specific prescription for the authenticated patient.",
               tags = {"prescriptions"})
    @GetMapping("/me/{prescriptionId}")
    @Secured({"ACCOUNT_TYPE_PATIENT"})
    public ResponseEntity<RestResponseDTO<PrescriptionDTO>> getMyPrescription(@PathVariable String prescriptionId,
                                                                              Principal principal) {
        PrescriptionDTO response = prescriptionService.getMyPrescription(prescriptionId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Prescription retrieved successfully.",
                                                       response));
    }
}
