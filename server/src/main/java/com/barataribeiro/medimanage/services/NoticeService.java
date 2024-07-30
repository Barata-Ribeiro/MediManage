package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.NoticeDTO;
import com.barataribeiro.medimanage.dtos.requests.NoticeRequestDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;

public interface NoticeService {
    NoticeDTO getLastPublished();

    Page<NoticeDTO> getAllNoticesPaginated(int page, int perPage, String direction, String orderBy);

    NoticeDTO getNoticeById(Long noticeId);

    NoticeDTO createNotice(NoticeRequestDTO body, Principal principal);
}
