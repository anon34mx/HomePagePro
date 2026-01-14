package com.anon34.HomePagePro.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anon34.HomePagePro.Repositories.Repo_shortCuts;
import com.anon34.HomePagePro.mappers.ShortcutsMapper;
import com.anon34.HomePagePro.dto.ShortcutsDTO;

@Service
public class ShortcutService {
    @Autowired
    private Repo_shortCuts repo_shortCuts;

    public List<ShortcutsDTO> all(){
        return repo_shortCuts.findAll().stream().map(ShortcutsMapper::toDTO)
            .collect(Collectors.toList());
    }
    // public String allAsHtml(){
    //      Corregir
    //     return repo_shortCuts.findAll().stream().map(ShortcutsMapper::toHtmlString);
    // }
}
