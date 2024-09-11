package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import com.barataribeiro.medimanage.services.HomeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

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
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getAdministratorInfo(Principal principal) {
        Map<String, Object> response = homeService.getAdministratorInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                       response));
    }

    @Operation(summary = "Get patient info",
               description = "Get the information of the logged in patient.",
               tags = {"home"})
    @GetMapping("/patient-info")
    @Secured("ACCOUNT_TYPE_PATIENT")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getPatientInfo(Principal principal) {
        Map<String, Object> response = homeService.getPatientInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                       response));
    }

    @Operation(summary = "Get assistant info",
               description = "Get the information of the logged in assistant.",
               tags = {"home"})
    @GetMapping("/assistant-info")
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getAssistantInfo(Principal principal) {
        Map<String, Object> response = homeService.getAssistantInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                       response));
    }

    @Operation(summary = "Get doctor info",
               description = "Get the information of the logged in doctor.",
               tags = {"home"})
    @GetMapping("/doctor-info")
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getDoctorInfo(Principal principal) {
        Map<String, Object> response = homeService.getDoctorInfo(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                       response));
    }

    // get methods with spring webflux
    @GetMapping("/stream/administrator-info")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAdministratorInfo(Principal principal) {
        return homeService.streamAdministratorInfo(principal);
    }

    @GetMapping("/stream/patient-info")
    @Secured("ACCOUNT_TYPE_PATIENT")
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamPatientInfo(Principal principal) {
        return homeService.streamPatientInfo(principal);
    }

    @GetMapping("/stream/assistant-info")
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAssistantInfo(Principal principal) {
        return homeService.streamAssistantInfo(principal);
    }

    @GetMapping("/stream/doctor-info")
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamDoctorInfo(Principal principal) {
        return homeService.streamDoctorInfo(principal);
    }
}
