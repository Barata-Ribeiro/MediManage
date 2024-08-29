package com.barataribeiro.medimanage.services.scheduler.impl;

import com.barataribeiro.medimanage.entities.enums.ConsultationStatus;
import com.barataribeiro.medimanage.entities.models.Consultation;
import com.barataribeiro.medimanage.entities.models.Notification;
import com.barataribeiro.medimanage.repositories.ConsultationRepository;
import com.barataribeiro.medimanage.repositories.NotificationRepository;
import com.barataribeiro.medimanage.services.scheduler.TransactionalService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TransactionalServiceImpl implements TransactionalService {
    private final ConsultationRepository consultationRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void updateConsultationStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<ConsultationStatus> statuses = List.of(ConsultationStatus.DONE, ConsultationStatus.MISSED,
                                                    ConsultationStatus.CANCELLED);

        List<Consultation> consultations = consultationRepository.findAllByScheduledToBeforeAndStatusNotIn(now,
                                                                                                           statuses);

        for (Consultation consultation : consultations) {
            consultation.setStatus(ConsultationStatus.MISSED);

            String doctorName = getDoctorName(consultation);
            String formattedScheduledTo = getFormattedScheduledTo(consultation);

            Notification notification = Notification.builder()
                    .title("Missed consultation!")
                    .message(String.format("You missed your consultation with %s at %s.",
                                           doctorName, formattedScheduledTo))
                    .user(consultation.getPatient())
                    .build();

            notificationRepository.save(notification);

        }

        consultationRepository.saveAll(consultations);
    }

    private @NotNull String getFormattedScheduledTo(@NotNull Consultation consultation) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");
        return consultation.getScheduledTo().format(formatter);
    }

    private String getDoctorName(@NotNull Consultation consultation) {
        return !consultation.getDoctor().getFullName().isEmpty()
               ? consultation.getDoctor().getFullName()
               : consultation.getDoctor().getUsername();
    }
}
