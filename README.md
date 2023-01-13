# @pfoerdie/policy-agent

First draft. Readme is not accurate!

## Structure

- _@function_ __enforce__
    - _@public_
    - _@returns_ {function} __enforce()__
        - _@public_
        - _@async_
        - _@param_ {object} request 
        - _@param_ {object} [response = null] 
        - _@param_ {function} [next] 
- __exec__
    - _@public_
    - _@function_ __exec.register__
        - _@param_ {function} action
        - _@param_ {string} action.id
- __repo__
    - _@public_
    - __repo.connected__
        - _@public_
        - _@type_ {boolean}
    - _@function_ __repo.connect__
        - _@public_
        - _@param_ {string} [hostname="localhost"]
        - _@param_ {string} [username="neo4j"]
        - _@param_ {string} [password="neo4j"]
    - _@function_ __repo.disconnect__ 
        - _@public_
    - _@function_ __repo.ping__ 
        - _@public_
        - _@async_
        - _@returns_ {Neo4j~ServerInfo}
        - _@async_
- __admin__
    - _@public_
    - _@function_ __admin.login__
        - _@public_
        - _@async_
- __info__
    - _@private_
- _@function_ __decide__
    - _@private_
    - _@async_
