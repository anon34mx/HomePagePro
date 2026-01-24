package com.anon34.HomePagePro.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anon34.HomePagePro.Repositories.Repo_shortCuts;
import com.anon34.HomePagePro.mappers.ShortcutsMapper;
import com.anon34.HomePagePro.dto.ShortcutsDTO;
import com.anon34.HomePagePro.entities.Shortcuts;

@Service
public class ShortcutService {
    @Autowired
    private Repo_shortCuts repo_shortCuts;

    public List<ShortcutsDTO> all(){
        return repo_shortCuts.findAll().stream().map(ShortcutsMapper::toDTO)
        .collect(Collectors.toList());
    }

    public ShortcutsDTO serv_getById(Long id){
        Shortcuts sh=repo_shortCuts.findById(id).orElseThrow(()->new RuntimeException(
            "Shortcut not found"
        ));
        return ShortcutsMapper.toDTO(sh);
    }
    
    public ShortcutsDTO serv_insert(ShortcutsDTO dto){
        System.out.println(dto);
        Shortcuts sh=ShortcutsMapper.toEntity(dto);
        Shortcuts inserted=repo_shortCuts.save(sh);
        return ShortcutsMapper.toDTO(inserted);
    }

    public ShortcutsDTO serv_update(ShortcutsDTO dto, Long id){
        Optional<Shortcuts> found; // = repo_shortCuts.findById(id);
        if(id > 0){
            found = repo_shortCuts.findById(id);
        }else{
            found = repo_shortCuts.findById(dto.getId());
        }
        if(found.isPresent()){
            Shortcuts sh=found.get();
            sh.setName(dto.getName());
            sh.setIcon(dto.getIcon());
            sh.setParentId(dto.getParentId());
            sh.setUri(dto.getUri());

            Shortcuts updated=repo_shortCuts.save(sh);
            return ShortcutsMapper.toDTO(updated);
        }else{
            throw new RuntimeException("Shortcut not found");
        }
    }

    public ShortcutsDTO serv_removeFromGroup(Long shortcutId){
        Optional<Shortcuts> found = repo_shortCuts.findById(shortcutId);
        if(found.isPresent()){
            Shortcuts sh=found.get();
            Long parentId = sh.getParentId();
            System.out.println("FOUND");
            System.out.println(sh);
            System.out.println(parentId);
            
            
            sh.setParentId(null);
            Shortcuts updated=repo_shortCuts.save(sh);

            if(parentId != null){
                List<ShortcutsDTO> group = repo_shortCuts.getTreeShortcuts(String.valueOf(parentId))
                    .stream().map(ShortcutsMapper::toDTO).collect(Collectors.toList());
                if(group.size()<1){ //delete empty group
                    this.deleteShortcut(parentId);
                }
            }
            return ShortcutsMapper.toDTO(updated);
        }else{
            throw new RuntimeException("Shortcut not found: "+shortcutId);
        }
    }

    // this
    public List<ShortcutsDTO> getTree(){
        List<ShortcutsDTO> all = repo_shortCuts.getTreeShortcuts(null).stream().map(ShortcutsMapper::toDTO).collect(Collectors.toList());

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
                ShortcutsDTO parent=lookup.get(s.getParentId());
                if(parent != null){
                    parent.getContent().add(s);
                }
            }
        }
        return roots;
    }

    public String deleteShortcut(Long id){
        if(repo_shortCuts.existsById(id)){
            repo_shortCuts.deleteById(id);
            return "deleted:"+id;
        }else{
            return "not found:"+id;
        }
    }
}
