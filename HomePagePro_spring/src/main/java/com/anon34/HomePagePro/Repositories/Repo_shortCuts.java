package com.anon34.HomePagePro.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.anon34.HomePagePro.entities.Shortcuts;

@Repository
public interface Repo_shortCuts extends JpaRepository<Shortcuts, Long>{
    public static final JdbcTemplate jdbcTemplate = new JdbcTemplate();

    @Query(value = "WITH RECURSIVE cte (id, parent_id, name, is_folder, uri, icon, type) AS ( " +
                "SELECT s.id, s.parent_id, s.name, s.is_folder, s.uri, s.icon, s.type FROM shortcuts s WHERE s.parent_id IS NULL " +
                "UNION ALL " +
                "SELECT child.id, child.parent_id, child.name, child.is_folder, child.uri, child.icon, child.type FROM shortcuts child INNER JOIN cte ON cte.id = child.parent_id " +
                ") SELECT id, parent_id, name, is_folder, uri, icon, type FROM cte ORDER BY id",
        nativeQuery = true
    )
    List<Shortcuts> getTreeShortcuts();
    
    // public default List<Shortcuts> getTreeShortcuts(){
    //     String tree_query = """
    //         WITH RECURSIVE cte (id,name,icon,uri,is_folder,type,parent_id,path) AS( Select parent.id,parent.name,parent.icon,parent.uri,parent.is_folder,parent.type,parent.parent_id, '' FROM shortcuts parent WHERE parent.parent_id IS NULL UNION ALL SELECT child.id,child.name,child.icon,child.uri,child.is_folder,child.type,child.parent_id, CONCAT(cte.path,child.parent_id) FROM shortcuts as child INNER JOIN cte ON cte.id=child.parent_id ) SELECT * FROM cte ORDER BY id, parent_id=id
    //         """;
    //     return jdbcTemplate.query(tree_query, (rs, rowNum)->{
    //         System.out.println(rs);
    //         Shortcuts s=new Shortcuts();
    //         s.setId(rs.getLong("id"));
    //         s.setFolder(rs.getBoolean("is_folder"));
    //         s.setName(rs.getString("name"));
    //         s.setUri(rs.getString("uri"));
    //         s.setIcon(rs.getString("icon"));
    //         return s;
    //     });

    // }
}