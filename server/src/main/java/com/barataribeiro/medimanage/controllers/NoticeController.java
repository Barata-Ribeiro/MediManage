package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.NoticeDTO;
import com.barataribeiro.medimanage.dtos.requests.NoticeRequestDTO;
import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import com.barataribeiro.medimanage.services.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NoticeController {
    private final NoticeService noticeService;

    @GetMapping("/public/latest")
    public ResponseEntity<RestResponseDTO<NoticeDTO>> getLastPublished() {
        NoticeDTO response = noticeService.getLastPublished();
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Latest notices retrieved successfully.",
                                                       response));
    }

    @GetMapping("/public/{noticeId}")
    public ResponseEntity<RestResponseDTO<NoticeDTO>> getLastPublished(@PathVariable Long noticeId) {
        NoticeDTO response = noticeService.getNoticeById(noticeId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Latest notices retrieved successfully.",
                                                       response));
    }

    @GetMapping
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<Page<NoticeDTO>>> getAllNotices(@RequestParam(defaultValue = "0") int page,
                                                                          @RequestParam(defaultValue = "10")
                                                                          int perPage,
                                                                          @RequestParam(defaultValue = "ASC")
                                                                          String direction,
                                                                          @RequestParam(defaultValue = "createdAt")
                                                                          String orderBy) {

        Page<NoticeDTO> response = noticeService.getAllNoticesPaginated(page, perPage, direction, orderBy);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "All notices retrieved successfully.",
                                                       response));
    }

    @GetMapping("/{noticeId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<NoticeDTO>> getNoticeById(@PathVariable Long noticeId) {
        NoticeDTO response = noticeService.getNoticeById(noticeId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Notice retrieved successfully.",
                                                       response));
    }

    @PostMapping
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<NoticeDTO>> createNotice(@RequestBody @Valid NoticeRequestDTO body,
                                                                   Principal principal) {
        NoticeDTO response = noticeService.createNotice(body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Notice created successfully.",
                                                       response));
    }

    @PatchMapping("/{noticeId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<NoticeDTO>> updateNotice(@PathVariable Long noticeId,
                                                                   @RequestBody @Valid NoticeRequestDTO body,
                                                                   Principal principal) {
        NoticeDTO response = noticeService.updateNotice(noticeId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Notice updated successfully.",
                                                       response));
    }
}
