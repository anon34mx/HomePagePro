package com.anon34.HomePagePro.controllers;

import java.io.File;
import java.io.IOException;
import java.awt.Desktop;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anon34.HomePagePro.dto.ShortcutsDTO;
import com.anon34.HomePagePro.services.ShortcutService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import com.anon34.HomePagePro.entities.Shortcuts.Type;



@RestController
public class ShorcutController {
    @Autowired
    private ShortcutService service;

    // ALL
    @GetMapping("/shortcuts")
    public List<ShortcutsDTO> getShortcuts(){
        return service.all();
    }

    // BY ID
    @GetMapping("/shortcuts/{id}")
    public ShortcutsDTO getShortcut(@PathVariable Long id){
        return service.serv_getById(id);
    }

    // INSERT
        /*
            {
                "id": null,
                "name": "new",
                "icon": "https://www.new.com/favicon.ico",
                "uri": "https://www.new.com/",
                "parentId": null,
                "content": [],
                "folder": false
            }
        */
    @PostMapping("/shortcuts")
    public ShortcutsDTO postMethodName(@RequestBody ShortcutsDTO dto) {
        System.out.println("CONTRKLLER");
        System.out.println(dto);

        if(!dto.isFolder()){
            if(dto.getName()==null || dto.getName().isEmpty()){
                throw new IllegalArgumentException("VALIDATE NAME");
            }
            return service.serv_insert(dto);
        }else{
            if(dto.getName()==null || dto.getName().isEmpty()){
                throw new IllegalArgumentException("VALIDATE NAME");
            }
            if(dto.getUri()==null || dto.getUri().isEmpty()){
                throw new IllegalArgumentException("VALIDATE URI");
            }
            return service.serv_insert(dto);
        }
        // return service.serv_insert(dto);
    }

    // UPDATE
    @PutMapping("/shortcuts/{id}")
    public String putMethodName(@PathVariable String id, @RequestBody String entity) {
        //TODO: process PUT request
        
        return entity;
    }
    
    // DELETE
    @DeleteMapping
    public String deleteShortcut(@PathVariable Long id){
        return "";
    }

    @GetMapping("/openExplorer/{path}")
    public String getMethodName(@PathVariable String path){
        String os = System.getProperty("os.name").toLowerCase();
        String ruta = "C:\\";

        try {
            if (os.contains("win")) {
                Runtime.getRuntime().exec(new String[]{"explorer", ruta});
                // Runtime.getRuntime().exec(new String[]{"explorer", "/select,", ruta});
                // Runtime.getRuntime().exec(new String("explorer \"c:\\\""));
            } else if (os.contains("mac")) {
                Runtime.getRuntime().exec(new String[]{"open", ruta});
            } else if (os.contains("nix") || os.contains("nux")) {
                Runtime.getRuntime().exec(new String[]{"xdg-open", ruta});
            } else {
                System.out.println("Sistema operativo no soportado.");
            }
        } catch (IOException e) { e.printStackTrace();

        }
        return "";
    }
    

    /*
    TEST raw json POST
        {
            "shortcut1":{
                "id": 1,
                "name": "new",
                "icon": "https://www.new.com/favicon.ico",
                "uri": "https://www.new.com/",
                "parentId": null,
                "content": [],
                "folder": false
            },
            "shortcut2":{
                "id": 3,
                "name": "new2",
                "icon": "https://www.new.com/favicon.ico",
                "uri": "https://www.new.com/",
                "parentId": null,
                "content": [],
                "folder": false
            }
        }
    */
    @PostMapping("/shortcuts/merge")
    public ShortcutsDTO merge(@RequestBody Map<String, ShortcutsDTO> shortcuts) {
        //create group
        ShortcutsDTO group = new ShortcutsDTO();
        group.setFolder(true);  
        group.setName("New Group");
        group.setContent(null);
        group.setIcon(null);
        group.setParentId(null);
        group.setUri(null);
        group.setType(Type.FOLDER);
        group.setFolder(true);
        group = service.serv_insert(group);
        

        // add both to group
        System.out.println("UPDATE SHORTCUTS");

        shortcuts.get("shortcut1").setParentId(group.getId());
        service.serv_update(shortcuts.get("shortcut1"), -1L);
        shortcuts.get("shortcut2").setParentId(group.getId());
        service.serv_update(shortcuts.get("shortcut2"), -1L);
        
        return group;
    }
    
    @PostMapping("/shortcuts/removeFromGroup")
    public ShortcutsDTO removeFromGroup(@RequestBody ShortcutsDTO shortcut) {
        //remove (changeparentId to null)
        // System.out.println("parameter: "+shortcut.getId());
        return service.serv_removeFromGroup(shortcut.getId());
    }

    @PostMapping("/shortcuts/removeFromGroup/{shortcutId}")
    public String removeFromGroup(@RequestBody Long shortcutId) {
        service.serv_removeFromGroup(shortcutId);
        return "entity";
    }
    
    
}
