WITH RECURSIVE cte (id,parent_id,name,isFolder, path) AS(
	SELECT parent.id, parent.parent_id, parent.name, parent.is_folder, ""
	FROM shortcuts parent
	WHERE parent.parent_id IS NULL
	UNION ALL
	SELECT child.id, child.parent_id, child.name, child.is_folder, CONCAT(cte.path,child.parent_id)
	FROM shortcuts as child
	INNER JOIN cte
		ON cte.id=child.parent_id
)
SELECT * FROM cte
ORDER BY id, parent_id=id