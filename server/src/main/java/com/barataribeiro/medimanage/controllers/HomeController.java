package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.services.HomeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HomeController {
    private final HomeService homeService;

    @Operation(summary = "Get administrator info",
               description = "Get the information of the logged in administrator.",
               tags = {"home"})
    @GetMapping("/administrator-info")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO> getAdministratorInfo(Principal principal) {
        Map<String, Object> response = homeService.getAdministratorInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                     response));
    }

    @Operation(summary = "Get patient info",
               description = "Get the information of the logged in patient.",
               tags = {"home"})
    @GetMapping("/patient-info")
    @Secured("ACCOUNT_TYPE_PATIENT")
    public ResponseEntity<RestResponseDTO> getPatientInfo(Principal principal) {
        Map<String, Object> response = homeService.getPatientInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                     response));
    }

    @Operation(summary = "Get assistant info",
               description = "Get the information of the logged in assistant.",
               tags = {"home"})
    @GetMapping("/assistant-info")
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO> getAssistantInfo(Principal principal) {
        Map<String, Object> response = homeService.getAssistantInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                     response));
    }

    @Operation(summary = "Get doctor info",
               description = "Get the information of the logged in doctor.",
               tags = {"home"})
    @GetMapping("/doctor-info")
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public ResponseEntity<RestResponseDTO> getDoctorInfo(Principal principal) {
        Map<String, Object> response = homeService.getDoctorInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                     response));
    }
}
