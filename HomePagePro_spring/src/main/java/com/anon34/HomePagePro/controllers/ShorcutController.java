package com.anon34.HomePagePro.controllers;

import java.io.File;
import java.io.IOException;
import java.awt.Desktop;
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




@RestController
public class ShorcutController {
    @Autowired
    private ShortcutService service;

    // ALL
    @GetMapping("/shortcuts")
    public Map<String, Object> getShortcuts(){
        Map<String, Object> shortcuts = new java.util.HashMap<>();
        shortcuts.put("About","https://anon34mx.github.io/");
        return shortcuts;
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

        // return dto;
        return service.serv_insert(dto);
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
    
}
