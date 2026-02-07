package com.anon34.HomePagePro.controllers;

import java.io.File;
import java.io.IOException;
import java.awt.Desktop;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

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
    
    @PostMapping("/shortcuts/addToGroup")
    public String postMethodName(@RequestBody Map<String, Long> params) {
        System.out.println(params);
        if(
            service.serv_addToGroup(
                params.get("shortcutId"),
                params.get("groupId")
            )
        ){
            return "done";
        }else{
            return "error";
        }
    }
    
    //webscrapping favicon
    @GetMapping("/getFavicon")
    public String getFavicon(@RequestParam String site) throws IOException {
        final Pattern uriPattern = Pattern.compile("[a-zA-Z]{1,6}:\\/\\/+(.)+\\/");
        final Pattern iconUriPattern = Pattern.compile("[a-zA-Z]{1,6}:\\/\\/+(.)+\\/(.*){1,}(\\.png|\\.ico)$");

        Matcher directnmatch=iconUriPattern.matcher(site);//url is an icon
        if(directnmatch.find()){
            System.out.println("link given is icon");
            return directnmatch.group(0);
        }
        if (!site.startsWith("http://") && !site.startsWith("https://")) {
            site = "https://" + site;
        }

        // look for the favicon
        Connection.Response response = Jsoup.connect(site).ignoreHttpErrors(true)
        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36")
        .referrer("https://www.google.com")
        .method(Connection.Method.GET)
        .data("pragma", "no-cache")
        .timeout(2000)
        .followRedirects(true)
        .execute();
        Document doc = response.parse();
        
        
        int statusCode = response.statusCode();
        String statusMessage = response.statusMessage();
        // String json = "{ \"statusCode\": " + statusCode + ", \"statusMessage\": \"" + statusMessage + "\" }";
        
        // search for something like <link rel="icon" type="image/png" href="favicon.png">
        Element iconLinks = doc.select("link[rel~=(?i)^(shortcut icon|icon)$]").first();
        String faviconUrl="";
        
        if(iconLinks!=null){
            faviconUrl=iconLinks.attr("href");
            Matcher ficonmatch=iconUriPattern.matcher(faviconUrl);
            String domain="";
            Matcher domMatch=uriPattern.matcher(site);
            System.out.println(domain);
            System.out.println(faviconUrl);
            if(domMatch.find()){
                domain=domMatch.group(0);
            }

            if(ficonmatch.find()){ // direct match - route has full route to file
                return  "{ \"statusCode\": " + statusCode + ", \"statusMessage\": \"" + statusMessage + "\", \"icon\":\""+faviconUrl+"\" }";
            }else if(domain!=""){ // route has relative route to file, needs to add the domain
                if(domain.charAt(domain.length()-1)=='/'){
                    domain=domain.substring(0, domain.length()-1);
                }
                if(faviconUrl.charAt(0)=='/'){
                    faviconUrl=faviconUrl.substring(1, faviconUrl.length());
                }
                // return domain+"/"+faviconUrl;
                return  "{ \"statusCode\": " + statusCode + ", \"statusMessage\": \"" + statusMessage + "\", \"icon\":\""+domain+"/"+faviconUrl+"\" }";
            }
        }
        return  "{ \"statusCode\": " + statusCode + ", \"statusMessage\": \"" + statusMessage + "\", \"icon\":\"x\" }";
    }
    
}
