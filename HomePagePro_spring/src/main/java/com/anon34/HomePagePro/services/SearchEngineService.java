package com.anon34.HomePagePro.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anon34.HomePagePro.Repositories.Repo_searchEngines;
import com.anon34.HomePagePro.dto.searchEnginesDTO;
import com.anon34.HomePagePro.mappers.SearchEnginesMapper;

@Service
public class SearchEngineService {
    @Autowired
    private Repo_searchEngines repoSearchEngines;
    
    public List<searchEnginesDTO> all(){
        return repoSearchEngines.findAll().stream().map(SearchEnginesMapper::toDTO)
        .collect(Collectors.toList());
        // .toList();
        
    }
}
