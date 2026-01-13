package com.anon34.HomePagePro.mappers;

import com.anon34.HomePagePro.dto.searchEnginesDTO;
import com.anon34.HomePagePro.entities.SearchEngines;

public class SearchEnginesMapper {
    public static searchEnginesDTO toDTO(SearchEngines searchEngines) {
        return new searchEnginesDTO(
            searchEngines.getId(),
            searchEngines.getName(),
            searchEngines.getUri(),
            searchEngines.getParameter(),
            searchEngines.getIcon(),
            searchEngines.getIsDefault()
        );
    }
}
