MATCH (asset:Entity:Asset)
WHERE all(
    key IN keys($param)
    // WHERE asset[key] = $param[key]
    WHERE CASE key 
        WHEN 'type' THEN any(type IN asset.type WHERE type = $param.type)
        ELSE asset[key] = $param[key]
    END
)

WITH collect(asset) as assets
RETURN CASE size(assets) 
    WHEN 1 THEN properties(assets[0])
    ELSE null 
END AS result