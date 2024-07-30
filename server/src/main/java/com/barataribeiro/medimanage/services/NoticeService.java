package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.NoticeDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;

public interface NoticeService {
    NoticeDTO getLastPublished();

    Page<NoticeDTO> getAllNotices(int page, int perPage, String direction, String orderBy);

    NoticeDTO getNoticeById(Long noticeId);

    NoticeDTO createNotice(Object body, Principal principal);
}
