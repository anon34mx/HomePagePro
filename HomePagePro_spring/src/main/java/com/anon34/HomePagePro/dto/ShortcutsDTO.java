package com.anon34.HomePagePro.dto;

public class ShortcutsDTO {
    private Long id;
    private boolean isFolder;
    private String name;
    private String uri;
    private String icon;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public boolean isFolder() {
        return isFolder;
    }
    public void setFolder(boolean isFolder) {
        this.isFolder = isFolder;
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
    public String getIcon() {
        return icon;
    }
    public void setIcon(String icon) {
        this.icon = icon;
    }

    public ShortcutsDTO(
        Long id, boolean isFolder, String name, String uri, String icon
    ){
        this.id = id;
        this.isFolder = isFolder;
        this.name = name;
        this.uri = uri;
        this.icon = icon;
    }
    
    @Override
    public String toString(){
        return "shortcuts [id=" + id + ", name=" + name + ", uri=" + uri + ", isFolder=" + isFolder + ", icon="
            + icon;
    }
}
