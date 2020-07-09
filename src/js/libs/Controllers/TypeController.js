/*
configurable
true if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.
Defaults to false.

enumerable
true if and only if this property shows up during enumeration of the properties on the corresponding object.
Defaults to false.

value
The value associated with the property. Can be any valid JavaScript value (number, object, function, etc).
Defaults to undefined.

writable
true if and only if the value associated with the property may be changed with an assignment operator.
Defaults to false.
*/

const createType = (type, extra, options = {}) => (key, value, extras) => {
    let obj = Object.defineProperties({}, {
        key: {
            value: key,
            writable: false,
        },
        value: {
            value: value,
            writable: true,
        },
        type: {
            value: type,
            writable: false
        },
        options: {
            value: {
                writable: options.writable !== undefined ? options.writable : true,
                enumerable: options.enumerable !== undefined ? options.enumerable : false,
                configurable: options.configurable !== undefined ? options.configurable : false
            },
            writable: false
        },
        iterator: {
            set() {
                throw new Error(`[${type}] Cannot set a value to iterator (enumerable)`);
            },
            get() {
                obj.options.enumerable = true
                return obj;
            }
        },
        const: {
            set() {
                throw new Error(`[${type}] Cannot set a value to const (writable = false)`);
            },
            get() {
                obj.options.writable = false
                return obj;
            }
        },
        config: {
            set() {
                throw new Error(`[${type}] Cannot set a value to config (configurable)`);
            },
            get() {
                obj.options.configurable = true
                return obj;
            }
        },
    });

    if (extra && typeof extra == 'string') {
        if (!extras) {
            throw new Error(`[${type}] property type ${type} requires a 3rd argument.`);
        }
        Object.defineProperty(obj, extra, {
            value: extras,
            writable: false,
        });
    }

    return obj;
};

/**
 * Types
 */
const string = createType('string');
const callback = createType('function');
const bool = createType('boolean');
const int = createType('number');
const Enum = createType('enum', 'values');

/**
 * create a type defined object.
 * @param {Object} article 
 * @param {Array} props 
 * @param {String} name 
 */
const createObject = (obj, props, name = 'Object') => {
    for (let i = 0; i < props.length; i++) {
        const element = props[i];
        Object.defineProperty(obj, element.key, {
            enumerable: element.options.enumerable,
            configurable: element.options.configurable,
            set(value) {
                if (!element.options.writable) {
                    throw new Error(`[${name}] property ${element.key} is read-only.`);
                }
                if (element.type == 'enum') {
                    if (element.values.indexOf(value) < 0) {
                        throw new Error(`[${name}] property ${element.key} must be a value of ${element.values.length < 2 ? `${element.values.join('')}` : `${element.values.slice(0, -1).join(', ')} or ${element.values.slice(-1)}`}.`);
                    }
                } else if (typeof value != element.type) {
                    throw new Error(`[${name}] property ${element.key} must be type of ${element.type}.`);
                }
                element.value = value;
            },
            get() {
                return element.value;
            }
        });
    }

    return obj;
}

module.exports = {
    string,
    bool,
    Enum,
    int,
    callback,

    createObject
}