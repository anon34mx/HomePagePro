package com.anon34.HomePagePro.entities;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="shortcuts")
public class Shortcuts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "isFolder", nullable = false)
    private boolean isFolder;

    @Column(name="name", nullable=false)
    private String name;

    @Column(name="uri", nullable=false)
    private String uri;

    @Column(name="icon", nullable=false)
    private String icon;

    public enum Type{
        FOLDER,
        SHORTCUT,
        OTHER
    }
    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private Type type;
}
