package com.anon34.HomePagePro.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class MainHppController {
    @Value("${app.version}")
    private String appVersion;

    @Value("${spring.application.name}")
    private String appName;
    
    @GetMapping
    public String home(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("appVersion", appVersion);
        model.addAttribute("currentTheme", "default");
        return "home";
    }
    
}
