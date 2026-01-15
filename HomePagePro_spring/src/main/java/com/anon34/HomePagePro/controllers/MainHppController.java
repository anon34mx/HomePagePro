package com.anon34.HomePagePro.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.anon34.HomePagePro.dto.ShortcutsDTO;
import com.anon34.HomePagePro.dto.searchEnginesDTO;
import com.anon34.HomePagePro.entities.Shortcuts;
import com.anon34.HomePagePro.services.SearchEngineService;
import com.anon34.HomePagePro.services.ShortcutService;

import org.springframework.ui.Model;

@Controller
public class MainHppController {
    private final SearchEngineService searchEngineService;
    private final ShortcutService shortcutService;

    public MainHppController(SearchEngineService searchEngineService, ShortcutService shortcutService) {
        this.searchEngineService = searchEngineService;
        this.shortcutService = shortcutService;
    }

    @Value("${app.version}")
    private String appVersion;

    @Value("${spring.application.name}")
    private String appName;
    
    @GetMapping
    public String home(Model model) {
        List<searchEnginesDTO> searchEngines = searchEngineService.all();
        System.out.println(searchEngines.toString()+"\n");

        System.out.println("TREE \n\n");
        List<ShortcutsDTO> shortcuts = shortcutService.getTree();
        System.out.println(shortcuts.toString()+"\n");
        
        model.addAttribute("appName", appName);
        model.addAttribute("appVersion", appVersion);
        model.addAttribute("currentTheme", "default");
        model.addAttribute("defaultSearchEngine", "https://www.google.com/search");
        model.addAttribute("searchParameterName", "q");
        model.addAttribute("searchEngines", searchEngines);

        model.addAttribute("shortcuts", shortcuts);
        return "home";
    }
    
}
