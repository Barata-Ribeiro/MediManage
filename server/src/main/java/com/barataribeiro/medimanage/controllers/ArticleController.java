package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.dtos.raw.SimpleArticleDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleUpdateRequestDTO;
import com.barataribeiro.medimanage.services.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ArticleController {
    private final ArticleService articleService;

    @GetMapping("/public/latest")
    public ResponseEntity<RestResponseDTO> getLatestArticles() {
        List<SimpleArticleDTO> response = articleService.getLatestArticles();
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Latest articles retrieved successfully.",
                                                     response));
    }

    @GetMapping("/public")
    public ResponseEntity<RestResponseDTO> getAllArticles(@RequestParam(required = false) String search,
                                                          @RequestParam(required = false) String category,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int perPage,
                                                          @RequestParam(defaultValue = "ASC") String direction,
                                                          @RequestParam(defaultValue = "createdAt") String orderBy) {
        Page<SimpleArticleDTO> response = articleService.getAllArticles(search, category, page, perPage, direction,
                                                                        orderBy);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "All articles retrieved successfully.",
                                                     response));
    }

    @GetMapping("/public/{articleId}")
    public ResponseEntity<RestResponseDTO> getArticleById(@PathVariable Long articleId) {
        ArticleDTO response = articleService.getArticleById(articleId);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Article retrieved successfully.",
                                                     response));
    }

    @PostMapping
    @Secured("ACCOUNT_TYPE_DOCTOR")
    public ResponseEntity<RestResponseDTO> createArticle(@RequestBody @Valid ArticleRequestDTO body,
                                                         Principal principal) {
        ArticleDTO response = articleService.createArticle(body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.CREATED,
                                                     HttpStatus.CREATED.value(),
                                                     "Article created successfully.",
                                                     response));
    }

    @PatchMapping("/{articleId}")
    @Secured({"ACCOUNT_TYPE_DOCTOR", "ACCOUNT_TYPE_ADMINISTRATOR"})
    public ResponseEntity<RestResponseDTO> updateArticle(@PathVariable Long articleId,
                                                         @RequestBody @Valid ArticleUpdateRequestDTO body,
                                                         Principal principal) {
        ArticleDTO response = articleService.updateArticle(articleId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Article updated successfully.",
                                                     response));
    }
}
