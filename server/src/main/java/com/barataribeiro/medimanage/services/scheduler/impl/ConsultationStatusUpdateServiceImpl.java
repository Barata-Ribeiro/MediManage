package com.barataribeiro.medimanage.services.scheduler.impl;

import com.barataribeiro.medimanage.services.scheduler.ConsultationStatusUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ConsultationStatusUpdateServiceImpl implements ConsultationStatusUpdateService {
    private final TransactionalServiceImpl transactionalServiceImpl;

    @Override
    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduleConsultationStatusUpdate() {
        transactionalServiceImpl.updateConsultationStatuses();
    }

    @Override
    @EventListener(ContextRefreshedEvent.class)
    public void onApplicationEvent() {
        transactionalServiceImpl.updateConsultationStatuses();
    }
}
