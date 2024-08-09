package com.barataribeiro.medimanage.services.scheduler;

public interface ConsultationStatusUpdateService {
    void scheduleConsultationStatusUpdate();

    void onApplicationEvent();
}
