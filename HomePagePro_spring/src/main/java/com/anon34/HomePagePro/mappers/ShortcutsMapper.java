package com.anon34.HomePagePro.mappers;

import com.anon34.HomePagePro.dto.ShortcutsDTO;
import com.anon34.HomePagePro.entities.Shortcuts;

public class ShortcutsMapper {
    public static ShortcutsDTO toDTO(Shortcuts shortcut){
        return new ShortcutsDTO(
            shortcut.getId(),
            shortcut.isFolder(),
            shortcut.getName(),
            shortcut.getUri(),
            shortcut.getIcon(),
            shortcut.getParentId()
        );
    }

    public static Shortcuts toEntity(ShortcutsDTO dto){
        System.out.println(dto);
        Shortcuts sh=new Shortcuts();
        sh.setId(dto.getId());
        sh.setName(dto.getName());
        sh.setUri(dto.getUri() != null ? dto.getUri() : "");
        sh.setIcon(dto.getIcon() != null ? dto.getIcon() : "");
        sh.setParentId(dto.getParentId());
        sh.setFolder(dto.isFolder());
        sh.setType(Shortcuts.Type.SHORTCUT);
        return sh;
    }

    public static String toHtmlString(Shortcuts shortcut){
        return ""+shortcut.getId()+" - "+shortcut.getName();
    }
}
