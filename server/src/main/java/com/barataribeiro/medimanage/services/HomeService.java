package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.security.Principal;
import java.util.Map;

public interface HomeService {
    Map<String, Object> getAdministratorInfo(Principal principal);

    Map<String, Object> getPatientInfo(Principal principal);

    Map<String, Object> getAssistantInfo(Principal principal);

    Map<String, Object> getDoctorInfo(Principal principal);

    Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAdministratorInfo(Principal principal);

    Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamPatientInfo(Principal principal);

    Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAssistantInfo(Principal principal);

    Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamDoctorInfo(Principal principal);
}
