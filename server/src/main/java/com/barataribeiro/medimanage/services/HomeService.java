package com.barataribeiro.medimanage.services;

import java.util.Map;

public interface HomeService {
    Map<String, Object> getAdministratorInfo();

    Map<String, Object> getPatientInfo();

    Map<String, Object> getAssistantInfo();

    Map<String, Object> getDoctorInfo();
}
