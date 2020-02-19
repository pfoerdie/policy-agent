MATCH (party:Entity:Party)
WHERE all(
    key IN keys($param)
    // WHERE party[key] = $param[key]
    WHERE CASE key 
        WHEN 'type' THEN any(type IN party.type WHERE type = $param.type)
        ELSE party[key] = $param[key]
    END
)

WITH collect(party) as parties
RETURN CASE size(parties) 
    WHEN 1 THEN properties(parties[0]) 
    ELSE null 
END AS result