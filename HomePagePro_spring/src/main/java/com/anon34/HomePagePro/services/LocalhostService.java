package com.anon34.HomePagePro.services;

import java.io.File;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

@Service
// lo que esté comentado va a quedar como referencia
public class LocalhostService {
    String localhostFolder="D:\\xampp\\htdocs\\";
    String localhost="http://localhost/";

    /*
        public Set<Map<String, Object>> listLocalhost(){
            Set<Map<String, Object>> ret = Stream.of(new File(localhostFolder).listFiles())
            // .filter(file->!file.isDirectory())
            // .map(File::getName)
            // .map(file->localhost+file.getName())
            .map(file->{
                Map<String, Object> fileInfo=new HashMap<>();
                fileInfo.put("name", file.getName());
                fileInfo.put("uri", localhost+file.getName());
                
                if(file.isDirectory()){
                    fileInfo.put("icon", "http://localhost:34/assets/themes/default/icons/folder_ByDinosoftLabs.png");
                    fileInfo.put("isFolder", file.isDirectory());
                }else{
                    fileInfo.put("icon", "http://localhost:34/assets/themes/default/icons/web-svgrepo-com.svg");
                    fileInfo.put("isFolder", file.isDirectory());
                }

                return fileInfo;
            })
            // .sorted(Comparator.comparing(m -> (boolean) m.get("isFolder")))
            .collect(Collectors.toSet());

            return ret;
        }
    */

    public List<Map<String, Object>> listLocalhostFiles(){
        List<Map<String, Object>> ret = Stream.of(new File(localhostFolder).listFiles())
        .map(file->{
            Map<String, Object> fileInfo=new HashMap<>();
            fileInfo.put("name", file.getName());
            fileInfo.put("uri", localhost+file.getName());
            fileInfo.put("isFolder", file.isDirectory());

            if(file.isDirectory()){
                fileInfo.put("icon", "http://localhost:34/assets/themes/default/icons/folder_ByDinosoftLabs.png");
                fileInfo.put("isFolder", file.isDirectory());
            }else{
                fileInfo.put("icon", "http://localhost:34/assets/themes/default/icons/web-svgrepo-com.svg");
                fileInfo.put("isFolder", file.isDirectory());
            }

            return fileInfo;
        }).sorted(
            Comparator.comparing((Map<String, Object> m) -> (Boolean) m.get("isFolder"))
            .reversed() // folders first, files later )
            .thenComparing((Map<String, Object> m) -> (String) m.get("name"))
        )
        .collect(Collectors.toList());

        return ret;
    }
}
