package com.anon34.HomePagePro.dto;

public class searchEnginesDTO {
    private Long id;
    private String name;
    private String uri;
    private String parameter;
    private String icon;
    private String isDefault;

    public searchEnginesDTO(Long id, String name, String uri, String parameter, String icon, String isDefault) {
        this.id = id;
        this.name = name;
        this.uri = uri;
        this.parameter = parameter;
        this.icon = icon;
        this.isDefault = isDefault;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getUri() {
        return uri;
    }
    public void setUri(String uri) {
        this.uri = uri;
    }
    public String getParameter() {
        return parameter;
    }
    public void setParameter(String parameter) {
        this.parameter = parameter;
    }
    public String getIcon() {
        return icon;
    }
    public void setIcon(String icon) {
        this.icon = icon;
    }
    public String getIsDefault() {
        return isDefault;
    }
    public void setIsDefault(String isDefault) {
        this.isDefault = isDefault;
    }
    @Override
    public String toString() {
        return "searchEngines [id=" + id + ", name=" + name + ", uri=" + uri + ", parameter=" + parameter + ", icon="
                + icon + ", isDefault=" + isDefault + "]";
    }
}
