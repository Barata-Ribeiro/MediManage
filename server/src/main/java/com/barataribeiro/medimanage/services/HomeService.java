package com.barataribeiro.medimanage.services;

import java.security.Principal;
import java.util.Map;

public interface HomeService {
    Map<String, Object> getAdministratorInfo(Principal principal);

    Map<String, Object> getPatientInfo(Principal principal);

    Map<String, Object> getAssistantInfo(Principal principal);

    Map<String, Object> getDoctorInfo(Principal principal);
}
