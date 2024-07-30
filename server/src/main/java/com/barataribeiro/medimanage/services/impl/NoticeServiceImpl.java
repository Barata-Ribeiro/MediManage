package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.NoticeMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.NoticeDTO;
import com.barataribeiro.medimanage.dtos.requests.NoticeRequestDTO;
import com.barataribeiro.medimanage.entities.enums.NoticeStatus;
import com.barataribeiro.medimanage.entities.enums.NoticeType;
import com.barataribeiro.medimanage.entities.models.Notice;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.notices.NoticeNotFoundException;
import com.barataribeiro.medimanage.exceptions.users.UserNotFoundException;
import com.barataribeiro.medimanage.repositories.NoticeRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.NoticeService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NoticeServiceImpl implements NoticeService {
    private final NoticeRepository noticeRepository;
    private final NoticeMapper noticeMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public NoticeDTO getLastPublished() {
        Notice notice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);
        return noticeMapper.toDTO(notice);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoticeDTO> getAllNoticesPaginated(int page, int perPage, @NotNull String direction, String orderBy) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Notice> notices = noticeRepository.findAll(pageable);

        List<NoticeDTO> noticeDTOS = noticeMapper.toDTOList(notices.getContent());

        return new PageImpl<>(noticeDTOS, pageable, notices.getTotalElements());
    }

    @Override
    public NoticeDTO getNoticeById(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId).orElseThrow(
                () -> new NoticeNotFoundException(String.format(ApplicationMessages.NOTICE_NOT_FOUND_WITH_ID, noticeId))
        );
        return noticeMapper.toDTO(notice);
    }

    @Override
    @Transactional
    public NoticeDTO createNotice(@NotNull NoticeRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(
                () -> new UserNotFoundException(
                        String.format(ApplicationMessages.USER_NOT_FOUND_WITH_ID, principal.getName()))
        );

        Notice newNotice = Notice.builder()
                .title(body.title())
                .description(body.description())
                .issuer(user)
                .build();

        setOptionalProperties(body, newNotice);

        return noticeMapper.toDTO(noticeRepository.saveAndFlush(newNotice));
    }

    @Override
    @Transactional
    public NoticeDTO updateNotice(Long noticeId, @NotNull NoticeRequestDTO body, Principal principal) {
        Notice notice = noticeRepository.findById(noticeId).orElseThrow(
                () -> new NoticeNotFoundException(String.format(ApplicationMessages.NOTICE_NOT_FOUND_WITH_ID, noticeId))
        );

        if (body.title() != null && !body.title().isEmpty()) {
            notice.setTitle(body.title());
        }

        if (body.description() != null && !body.description().isEmpty()) {
            notice.setDescription(body.description());
        }

        setOptionalProperties(body, notice);

        return noticeMapper.toDTO(noticeRepository.saveAndFlush(notice));
    }

    private void setOptionalProperties(@NotNull NoticeRequestDTO body, Notice notice) {
        if (body.mediaUrl() != null && !body.mediaUrl().isEmpty()) {
            notice.setMediaUrl(body.mediaUrl());
        }

        if (body.type() != null && !body.type().isEmpty()) {
            NoticeType type = NoticeType.valueOf(body.type());
            notice.setType(type);
        }

        if (body.status() != null && !body.status().isEmpty()) {
            NoticeStatus status = NoticeStatus.valueOf(body.status());
            notice.setStatus(status);
        }
    }
}
