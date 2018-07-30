/**
 * @module Utility
 * @author Simon Petrac
 */

/**
* Builds a public class by removing _ properties and instance attributes.
* @function buildPublicClass
* @param {class} privateClass The source for the public class.
* @returns {class} The public class with calls to the private properties. 
*/
exports.buildPublicClass = ((/* closure */) => {
    const privateClassesMap = new WeakMap();

    const publicInstancesMap = new WeakMap();
    const privateInstancesMap = new WeakMap();

    function filterPublicInstance(obj) {
        if (publicInstancesMap.has(obj))
            return publicInstancesMap.get(obj);
        else if (Array.isArray(obj))
            return obj.map(filterPublicInstance);
        else
            return obj;
    } // filterPublicInstance

    function filterPrivateInstance(obj) {
        if (privateInstancesMap.has(obj))
            return privateInstancesMap.get(obj);
        else if (Array.isArray(obj))
            return obj.map(filterPrivateInstance);
        else
            return obj;
    } // filterPrivateInstance

    function buildPublicClass(privateClass) {

        if (typeof privateClass !== 'function' || !privateClass.prototype)
            throw new Error(`buildPublicClass(privateClass) -> privateClass has to be a class`);

        if (privateClassesMap.has(privateClass))
            return privateClassesMap.get(privateClass);

        /** 1. create the public class */
        class publicClass {
            constructor(...publicArgs) {
                let privateInstance = new privateClass(...publicArgs);
                /** 1.1. save the relation between the public and private instance in the WeakMaps */
                publicInstancesMap.set(this, privateInstance);
                privateInstancesMap.set(privateInstance, this);
            }
        };

        /** 2. transfer all public properties of the class */
        for (let key of Reflect.ownKeys(privateClass)) {
            /** 2.1. skip private properties, etc. */
            if (key.startsWith('_')) continue;
            if (key === 'prototype') continue;

            /** 2.2. get the complete property definition of the class */
            let privateProperty = Reflect.getOwnPropertyDescriptor(privateClass, key);
            let publicProperty = {};

            /** 2.3. some attributes of the property can easyly be transfered */
            if (privateProperty.configurable) publicProperty.configurable = true;
            if (privateProperty.enumerable) publicProperty.enumerable = true;

            if (privateProperty.get || privateProperty.set) {
                /** 2.4a. if the property is a getter/setter */
                if (privateProperty.get) {
                    /** 2.4a.1. the getter */
                    publicProperty.get = function () {
                        let privateResult = privateProperty.get.call(privateClass);
                        return filterPrivateInstance(privateResult);
                    };
                }

                if (privateProperty.set) {
                    /** 2.4a.2. the setter */
                    publicProperty.set = function (publicValue) {
                        let privatValue = filterPublicInstance(publicValue);
                        privateProperty.set.call(privateClass, privatValue);
                    };
                }
            } else {
                /** 2.4b. if the property is a value */
                if (privateProperty.writable) publicProperty.writable = true;

                if (typeof privateProperty.value === 'function') {
                    /** 2.4b.1 usually its a function */
                    publicProperty.value = function (...publicArgs) {
                        let privatArgs = filterPublicInstance(publicArgs);
                        let privateResult = privateProperty.value.apply(privateClass, privatArgs);
                        return filterPrivateInstance(privateResult);
                    };
                } else {
                    /** 2.4b.2 sometimes not */
                    publicProperty.get = function () {
                        let privateResult = privateProperty.value;
                        return filterPrivateInstance(privateResult);
                    };
                }
            }

            /** 2.5. write the public property to the class */
            Object.defineProperty(publicClass, key, publicProperty);
        }

        /** 3. transfer all public properties for the instances into the prototype */
        for (let protoKey of Reflect.ownKeys(privateClass.prototype)) {
            /** 3.1. skip private properties, etc. */
            if (protoKey.startsWith('_')) continue;
            if (protoKey === 'constructor') continue;

            /** 3.2. get the complete property definition of the prototype */
            let privateProtoProperty = Reflect.getOwnPropertyDescriptor(privateClass.prototype, protoKey);
            let publicProtoProperty = {};

            /** 3.3. some attributes of the property can easyly be transfered */
            if (privateProtoProperty.configurable) publicProtoProperty.configurable = true;
            if (privateProtoProperty.enumerable) publicProtoProperty.enumerable = true;

            if (privateProtoProperty.get || privateProtoProperty.set) {
                /** 3.4a. if the property is a getter/setter */
                if (privateProtoProperty.get) {
                    /** 3.4a.1. the getter */
                    publicProtoProperty.get = function () {
                        if (!publicInstancesMap.has(this)) return;

                        let privateResult = privateProtoProperty.get.call(publicInstancesMap.get(this));
                        return filterPrivateInstance(privateResult);
                    };
                }

                if (privateProtoProperty.set) {
                    /** 3.4a.2. the setter */
                    publicProtoProperty.set = function (publicValue) {
                        if (!publicInstancesMap.has(this)) return;

                        let privatValue = filterPublicInstance(publicValue);
                        privateProtoProperty.set.call(publicInstancesMap.get(this), privatValue);
                    };
                }
            } else {
                /** 3.4b. if the property is a value */
                if (privateProtoProperty.writable) publicProtoProperty.writable = true;

                if (typeof privateProtoProperty.value === 'function') {
                    /** 3.4b.1 usually its a function */
                    publicProtoProperty.value = function (...publicArgs) {
                        if (!publicInstancesMap.has(this)) return;

                        let privatArgs = filterPublicInstance(publicArgs);
                        let privateResult = privateProtoProperty.value.apply(publicInstancesMap.get(this), privatArgs);
                        return filterPrivateInstance(privateResult);
                    };
                } else {
                    /** 3.4b.2 sometimes not */
                    publicProtoProperty.get = function () {
                        if (!publicInstancesMap.has(this)) return;

                        let privateResult = privateProtoProperty.value;
                        return filterPrivateInstance(privateResult);
                    };
                }
            }

            /** 3.5. write the public property to the prototype */
            Object.defineProperty(publicClass.prototype, protoKey, publicProtoProperty);
        }

        /** 4. public class is finished */
        privateClassesMap.set(privateClass, publicClass);

        return publicClass;

    } // buildPublicClass

    return buildPublicClass;
})(/* closure */); // exports.buildPublicClass