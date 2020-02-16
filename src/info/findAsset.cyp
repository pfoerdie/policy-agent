MATCH (asset:Asset { type: $type, uid: $uid })
RETURN asset