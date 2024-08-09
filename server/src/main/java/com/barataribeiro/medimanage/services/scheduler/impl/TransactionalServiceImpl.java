package com.barataribeiro.medimanage.services.scheduler.impl;

import com.barataribeiro.medimanage.entities.enums.ConsultationStatus;
import com.barataribeiro.medimanage.entities.models.Consultation;
import com.barataribeiro.medimanage.repositories.ConsultationRepository;
import com.barataribeiro.medimanage.services.scheduler.TransactionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TransactionalServiceImpl implements TransactionalService {
    private final ConsultationRepository consultationRepository;

    @Override
    @Transactional
    public void updateConsultationStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<ConsultationStatus> statuses = List.of(ConsultationStatus.DONE, ConsultationStatus.MISSED, ConsultationStatus.CANCELLED);

        List<Consultation> consultations = consultationRepository.findAllByScheduledToBeforeAndStatusNotIn(now, statuses);

        for (Consultation consultation : consultations) {
            consultation.setStatus(ConsultationStatus.MISSED);
        }

        consultationRepository.saveAll(consultations);
    }
}
