package com.anon34.HomePagePro.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Entity; // For Spring Boot 3+ and JDK 17+
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "search_engines")
public class SearchEngines {
    @Id
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "uri", nullable = false)
    private String uri;

    @Column(name = "parameter", nullable = false)
    private String parameter;

    @Column(name = "icon", nullable = false)
    private String icon;

    @Column(name = "isDefault", nullable = false)
    private String isDefault;
}
