package com.barataribeiro.medimanage.services;

import java.util.Map;

public interface HomeService {
    Map<String, String> getAdministratorInfo();

    Map<String, String> getPatientInfo();

    Map<String, String> getAssistantInfo();

    Map<String, String> getDoctorInfo();
}
