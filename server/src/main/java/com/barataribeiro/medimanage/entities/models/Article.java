package com.barataribeiro.medimanage.entities.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_articles", indexes = {
        @Index(name = "idx_article_title_unq", columnList = "title", unique = true)
})
@NamedEntityGraph(name = "Article.author.categories", attributeNodes = {
        @NamedAttributeNode("author"),
        @NamedAttributeNode("categories")
})
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "sub_title", nullable = false)
    private String subTitle;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String slug;

    @Column(name = "media_url")
    private String mediaUrl;

    @Builder.Default
    @Column(name = "was_edit")
    private Boolean wasEdit = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id")
    private User author;

    @ToString.Exclude
    @Builder.Default
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinTable(name = "tb_articles_categories",
            joinColumns = @JoinColumn(name = "article_"),
            inverseJoinColumns = @JoinColumn(name = "categories_id"))
    private Set<Category> categories = new LinkedHashSet<>();

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;

}