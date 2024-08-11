package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.services.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HomeController {
    private final HomeService homeService;

    @GetMapping("/administrator-info")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO> getAdministratorInfo() {
        Map<String, String> response = homeService.getAdministratorInfo();
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                response));
    }

    @GetMapping("/patient-info")
    @Secured("ACCOUNT_TYPE_PATIENT")
    public ResponseEntity<RestResponseDTO> getPatientInfo() {
        Map<String, String> response = homeService.getPatientInfo();
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                response));
    }

    @GetMapping("/assistant-info")
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO> getAssistantInfo() {
        Map<String, String> response = homeService.getAssistantInfo();
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                response));
    }

    @GetMapping("/doctor-info")
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public ResponseEntity<RestResponseDTO> getDoctorInfo() {
        Map<String, String> response = homeService.getDoctorInfo();
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                HttpStatus.OK.value(),
                ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                response));
    }
}
