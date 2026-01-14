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
            shortcut.getIcon()
        );
    }

    public static String toHtmlString(Shortcuts shortcut){
        return ""+shortcut.getId()+" - "+shortcut.getName();
    }
}
