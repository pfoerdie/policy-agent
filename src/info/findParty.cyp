MATCH (party:Party { type: $type, uid: $uid })
RETURN party