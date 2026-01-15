package com.anon34.HomePagePro.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    
    // public List<ShortcutsDTO> getTree(){
    //     return repo_shortCuts.getTreeShortcuts().stream().map(ShortcutsMapper::toDTO)
    //     .collect(Collectors.toList());
    // }

    // this
    public List<ShortcutsDTO> getTree(){
        List<ShortcutsDTO> all = repo_shortCuts.getTreeShortcuts().stream().map(ShortcutsMapper::toDTO)
        .collect(Collectors.toList());

        System.out.println("ALL");
        System.out.println(all);

        Map<Long, ShortcutsDTO> lookup = new HashMap<>();
        List<ShortcutsDTO> roots=new ArrayList<>();

        for(ShortcutsDTO s:all){
            lookup.put(s.getId(), s);
        }

        for(ShortcutsDTO s:all){
            if(s.getParentId() == null){
                roots.add(s);
            }else{
                // System.out.println("PARENT:"+s.getParentId());
                ShortcutsDTO parent=lookup.get(s.getParentId());
                if(parent != null){
                    parent.getContent().add(s);
                }
            }
        }
        return roots;
    }
}
