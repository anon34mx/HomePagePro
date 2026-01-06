package com.anon34.HomePagePro.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ShorcutController {

    @GetMapping("/shortcuts")
    public Map<String, Object> getShortcuts(){
        Map<String, Object> shortcuts = new java.util.HashMap<>();
        shortcuts.put("About","https://anon34mx.github.io/");
        return shortcuts;
    }
}
