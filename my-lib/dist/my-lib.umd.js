(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['my-lib'] = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    var TransformationType;
    (function (TransformationType) {
        TransformationType[TransformationType["PLAIN_TO_CLASS"] = 0] = "PLAIN_TO_CLASS";
        TransformationType[TransformationType["CLASS_TO_PLAIN"] = 1] = "CLASS_TO_PLAIN";
        TransformationType[TransformationType["CLASS_TO_CLASS"] = 2] = "CLASS_TO_CLASS";
    })(TransformationType || (TransformationType = {}));

    /**
     * Storage all library metadata.
     */
    var MetadataStorage = /** @class */ (function () {
        function MetadataStorage() {
            // -------------------------------------------------------------------------
            // Properties
            // -------------------------------------------------------------------------
            this._typeMetadatas = new Map();
            this._transformMetadatas = new Map();
            this._exposeMetadatas = new Map();
            this._excludeMetadatas = new Map();
            this._ancestorsMap = new Map();
        }
        // -------------------------------------------------------------------------
        // Adder Methods
        // -------------------------------------------------------------------------
        MetadataStorage.prototype.addTypeMetadata = function (metadata) {
            if (!this._typeMetadatas.has(metadata.target)) {
                this._typeMetadatas.set(metadata.target, new Map());
            }
            this._typeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
        };
        MetadataStorage.prototype.addTransformMetadata = function (metadata) {
            if (!this._transformMetadatas.has(metadata.target)) {
                this._transformMetadatas.set(metadata.target, new Map());
            }
            if (!this._transformMetadatas.get(metadata.target).has(metadata.propertyName)) {
                this._transformMetadatas.get(metadata.target).set(metadata.propertyName, []);
            }
            this._transformMetadatas.get(metadata.target).get(metadata.propertyName).push(metadata);
        };
        MetadataStorage.prototype.addExposeMetadata = function (metadata) {
            if (!this._exposeMetadatas.has(metadata.target)) {
                this._exposeMetadatas.set(metadata.target, new Map());
            }
            this._exposeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
        };
        MetadataStorage.prototype.addExcludeMetadata = function (metadata) {
            if (!this._excludeMetadatas.has(metadata.target)) {
                this._excludeMetadatas.set(metadata.target, new Map());
            }
            this._excludeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
        };
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        MetadataStorage.prototype.findTransformMetadatas = function (target, propertyName, transformationType) {
            return this.findMetadatas(this._transformMetadatas, target, propertyName).filter(function (metadata) {
                if (!metadata.options)
                    return true;
                if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
                    return true;
                if (metadata.options.toClassOnly === true) {
                    return (transformationType === TransformationType.CLASS_TO_CLASS ||
                        transformationType === TransformationType.PLAIN_TO_CLASS);
                }
                if (metadata.options.toPlainOnly === true) {
                    return transformationType === TransformationType.CLASS_TO_PLAIN;
                }
                return true;
            });
        };
        MetadataStorage.prototype.findExcludeMetadata = function (target, propertyName) {
            return this.findMetadata(this._excludeMetadatas, target, propertyName);
        };
        MetadataStorage.prototype.findExposeMetadata = function (target, propertyName) {
            return this.findMetadata(this._exposeMetadatas, target, propertyName);
        };
        MetadataStorage.prototype.findExposeMetadataByCustomName = function (target, name) {
            return this.getExposedMetadatas(target).find(function (metadata) {
                return metadata.options && metadata.options.name === name;
            });
        };
        MetadataStorage.prototype.findTypeMetadata = function (target, propertyName) {
            return this.findMetadata(this._typeMetadatas, target, propertyName);
        };
        MetadataStorage.prototype.getStrategy = function (target) {
            var excludeMap = this._excludeMetadatas.get(target);
            var exclude = excludeMap && excludeMap.get(undefined);
            var exposeMap = this._exposeMetadatas.get(target);
            var expose = exposeMap && exposeMap.get(undefined);
            if ((exclude && expose) || (!exclude && !expose))
                return 'none';
            return exclude ? 'excludeAll' : 'exposeAll';
        };
        MetadataStorage.prototype.getExposedMetadatas = function (target) {
            return this.getMetadata(this._exposeMetadatas, target);
        };
        MetadataStorage.prototype.getExcludedMetadatas = function (target) {
            return this.getMetadata(this._excludeMetadatas, target);
        };
        MetadataStorage.prototype.getExposedProperties = function (target, transformationType) {
            return this.getExposedMetadatas(target)
                .filter(function (metadata) {
                if (!metadata.options)
                    return true;
                if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
                    return true;
                if (metadata.options.toClassOnly === true) {
                    return (transformationType === TransformationType.CLASS_TO_CLASS ||
                        transformationType === TransformationType.PLAIN_TO_CLASS);
                }
                if (metadata.options.toPlainOnly === true) {
                    return transformationType === TransformationType.CLASS_TO_PLAIN;
                }
                return true;
            })
                .map(function (metadata) { return metadata.propertyName; });
        };
        MetadataStorage.prototype.getExcludedProperties = function (target, transformationType) {
            return this.getExcludedMetadatas(target)
                .filter(function (metadata) {
                if (!metadata.options)
                    return true;
                if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
                    return true;
                if (metadata.options.toClassOnly === true) {
                    return (transformationType === TransformationType.CLASS_TO_CLASS ||
                        transformationType === TransformationType.PLAIN_TO_CLASS);
                }
                if (metadata.options.toPlainOnly === true) {
                    return transformationType === TransformationType.CLASS_TO_PLAIN;
                }
                return true;
            })
                .map(function (metadata) { return metadata.propertyName; });
        };
        MetadataStorage.prototype.clear = function () {
            this._typeMetadatas.clear();
            this._exposeMetadatas.clear();
            this._excludeMetadatas.clear();
            this._ancestorsMap.clear();
        };
        // -------------------------------------------------------------------------
        // Private Methods
        // -------------------------------------------------------------------------
        MetadataStorage.prototype.getMetadata = function (metadatas, target) {
            var metadataFromTargetMap = metadatas.get(target);
            var metadataFromTarget;
            if (metadataFromTargetMap) {
                metadataFromTarget = Array.from(metadataFromTargetMap.values()).filter(function (meta) { return meta.propertyName !== undefined; });
            }
            var metadataFromAncestors = [];
            for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
                var ancestor = _a[_i];
                var ancestorMetadataMap = metadatas.get(ancestor);
                if (ancestorMetadataMap) {
                    var metadataFromAncestor = Array.from(ancestorMetadataMap.values()).filter(function (meta) { return meta.propertyName !== undefined; });
                    metadataFromAncestors.push.apply(metadataFromAncestors, metadataFromAncestor);
                }
            }
            return metadataFromAncestors.concat(metadataFromTarget || []);
        };
        MetadataStorage.prototype.findMetadata = function (metadatas, target, propertyName) {
            var metadataFromTargetMap = metadatas.get(target);
            if (metadataFromTargetMap) {
                var metadataFromTarget = metadataFromTargetMap.get(propertyName);
                if (metadataFromTarget) {
                    return metadataFromTarget;
                }
            }
            for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
                var ancestor = _a[_i];
                var ancestorMetadataMap = metadatas.get(ancestor);
                if (ancestorMetadataMap) {
                    var ancestorResult = ancestorMetadataMap.get(propertyName);
                    if (ancestorResult) {
                        return ancestorResult;
                    }
                }
            }
            return undefined;
        };
        MetadataStorage.prototype.findMetadatas = function (metadatas, target, propertyName) {
            var metadataFromTargetMap = metadatas.get(target);
            var metadataFromTarget;
            if (metadataFromTargetMap) {
                metadataFromTarget = metadataFromTargetMap.get(propertyName);
            }
            var metadataFromAncestorsTarget = [];
            for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
                var ancestor = _a[_i];
                var ancestorMetadataMap = metadatas.get(ancestor);
                if (ancestorMetadataMap) {
                    if (ancestorMetadataMap.has(propertyName)) {
                        metadataFromAncestorsTarget.push.apply(metadataFromAncestorsTarget, ancestorMetadataMap.get(propertyName));
                    }
                }
            }
            return metadataFromAncestorsTarget
                .slice()
                .reverse()
                .concat((metadataFromTarget || []).slice().reverse());
        };
        MetadataStorage.prototype.getAncestors = function (target) {
            if (!target)
                return [];
            if (!this._ancestorsMap.has(target)) {
                var ancestors = [];
                for (var baseClass = Object.getPrototypeOf(target.prototype.constructor); typeof baseClass.prototype !== 'undefined'; baseClass = Object.getPrototypeOf(baseClass.prototype.constructor)) {
                    ancestors.push(baseClass);
                }
                this._ancestorsMap.set(target, ancestors);
            }
            return this._ancestorsMap.get(target);
        };
        return MetadataStorage;
    }());

    /**
     * Default metadata storage is used as singleton and can be used to storage all metadatas.
     */
    var defaultMetadataStorage = new MetadataStorage();

    /**
     * Specifies a type of the property.
     * The given TypeFunction can return a constructor. A discriminator can be given in the options.
     *
     * Can be applied to properties only.
     */
    function Type(typeFunction, options) {
        if (options === void 0) { options = {}; }
        return function (target, propertyName) {
            var reflectedType = Reflect.getMetadata('design:type', target, propertyName);
            defaultMetadataStorage.addTypeMetadata({
                target: target.constructor,
                propertyName: propertyName,
                reflectedType: reflectedType,
                typeFunction: typeFunction,
                options: options,
            });
        };
    }

    /**
     * This metadata contains validation rules.
     */
    var ValidationMetadata = /** @class */ (function () {
        // -------------------------------------------------------------------------
        // Constructor
        // -------------------------------------------------------------------------
        function ValidationMetadata(args) {
            /**
             * Validation groups used for this validation.
             */
            this.groups = [];
            /**
             * Specifies if validated value is an array and each of its item must be validated.
             */
            this.each = false;
            /*
             * A transient set of data passed through to the validation result for response mapping
             */
            this.context = undefined;
            this.type = args.type;
            this.target = args.target;
            this.propertyName = args.propertyName;
            this.constraints = args.constraints;
            this.constraintCls = args.constraintCls;
            this.validationTypeOptions = args.validationTypeOptions;
            if (args.validationOptions) {
                this.message = args.validationOptions.message;
                this.groups = args.validationOptions.groups;
                this.always = args.validationOptions.always;
                this.each = args.validationOptions.each;
                this.context = args.validationOptions.context;
            }
        }
        return ValidationMetadata;
    }());

    /**
     * Used to transform validation schemas to validation metadatas.
     */
    var ValidationSchemaToMetadataTransformer = /** @class */ (function () {
        function ValidationSchemaToMetadataTransformer() {
        }
        ValidationSchemaToMetadataTransformer.prototype.transform = function (schema) {
            var metadatas = [];
            Object.keys(schema.properties).forEach(function (property) {
                schema.properties[property].forEach(function (validation) {
                    var validationOptions = {
                        message: validation.message,
                        groups: validation.groups,
                        always: validation.always,
                        each: validation.each,
                    };
                    var args = {
                        type: validation.type,
                        target: schema.name,
                        propertyName: property,
                        constraints: validation.constraints,
                        validationTypeOptions: validation.options,
                        validationOptions: validationOptions,
                    };
                    metadatas.push(new ValidationMetadata(args));
                });
            });
            return metadatas;
        };
        return ValidationSchemaToMetadataTransformer;
    }());

    /**
     * This function returns the global object across Node and browsers.
     *
     * Note: `globalThis` is the standardized approach however it has been added to
     * Node.js in version 12. We need to include this snippet until Node 12 EOL.
     */
    function getGlobal() {
        if (typeof globalThis !== 'undefined') {
            return globalThis;
        }
        if (typeof global !== 'undefined') {
            return global;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Cannot find name 'window'.
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: Cannot find name 'window'.
            return window;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Cannot find name 'self'.
        if (typeof self !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: Cannot find name 'self'.
            return self;
        }
    }

    /**
     * Storage all metadatas.
     */
    var MetadataStorage$1 = /** @class */ (function () {
        function MetadataStorage() {
            // -------------------------------------------------------------------------
            // Private properties
            // -------------------------------------------------------------------------
            this.validationMetadatas = [];
            this.constraintMetadatas = [];
        }
        Object.defineProperty(MetadataStorage.prototype, "hasValidationMetaData", {
            get: function () {
                return !!this.validationMetadatas.length;
            },
            enumerable: false,
            configurable: true
        });
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        /**
         * Adds a new validation metadata.
         */
        MetadataStorage.prototype.addValidationSchema = function (schema) {
            var _this = this;
            var validationMetadatas = new ValidationSchemaToMetadataTransformer().transform(schema);
            validationMetadatas.forEach(function (validationMetadata) { return _this.addValidationMetadata(validationMetadata); });
        };
        /**
         * Adds a new validation metadata.
         */
        MetadataStorage.prototype.addValidationMetadata = function (metadata) {
            this.validationMetadatas.push(metadata);
        };
        /**
         * Adds a new constraint metadata.
         */
        MetadataStorage.prototype.addConstraintMetadata = function (metadata) {
            this.constraintMetadatas.push(metadata);
        };
        /**
         * Groups metadata by their property names.
         */
        MetadataStorage.prototype.groupByPropertyName = function (metadata) {
            var grouped = {};
            metadata.forEach(function (metadata) {
                if (!grouped[metadata.propertyName])
                    grouped[metadata.propertyName] = [];
                grouped[metadata.propertyName].push(metadata);
            });
            return grouped;
        };
        /**
         * Gets all validation metadatas for the given object with the given groups.
         */
        MetadataStorage.prototype.getTargetValidationMetadatas = function (targetConstructor, targetSchema, always, strictGroups, groups) {
            var includeMetadataBecauseOfAlwaysOption = function (metadata) {
                // `metadata.always` overrides global default.
                if (typeof metadata.always !== 'undefined')
                    return metadata.always;
                // `metadata.groups` overrides global default.
                if (metadata.groups && metadata.groups.length)
                    return false;
                // Use global default.
                return always;
            };
            var excludeMetadataBecauseOfStrictGroupsOption = function (metadata) {
                if (strictGroups) {
                    // Validation is not using groups.
                    if (!groups || !groups.length) {
                        // `metadata.groups` has at least one group.
                        if (metadata.groups && metadata.groups.length)
                            return true;
                    }
                }
                return false;
            };
            // get directly related to a target metadatas
            var originalMetadatas = this.validationMetadatas.filter(function (metadata) {
                if (metadata.target !== targetConstructor && metadata.target !== targetSchema)
                    return false;
                if (includeMetadataBecauseOfAlwaysOption(metadata))
                    return true;
                if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
                    return false;
                if (groups && groups.length > 0)
                    return metadata.groups && !!metadata.groups.find(function (group) { return groups.indexOf(group) !== -1; });
                return true;
            });
            // get metadatas for inherited classes
            var inheritedMetadatas = this.validationMetadatas.filter(function (metadata) {
                // if target is a string it's means we validate against a schema, and there is no inheritance support for schemas
                if (typeof metadata.target === 'string')
                    return false;
                if (metadata.target === targetConstructor)
                    return false;
                if (metadata.target instanceof Function && !(targetConstructor.prototype instanceof metadata.target))
                    return false;
                if (includeMetadataBecauseOfAlwaysOption(metadata))
                    return true;
                if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
                    return false;
                if (groups && groups.length > 0)
                    return metadata.groups && !!metadata.groups.find(function (group) { return groups.indexOf(group) !== -1; });
                return true;
            });
            // filter out duplicate metadatas, prefer original metadatas instead of inherited metadatas
            var uniqueInheritedMetadatas = inheritedMetadatas.filter(function (inheritedMetadata) {
                return !originalMetadatas.find(function (originalMetadata) {
                    return (originalMetadata.propertyName === inheritedMetadata.propertyName &&
                        originalMetadata.type === inheritedMetadata.type);
                });
            });
            return originalMetadatas.concat(uniqueInheritedMetadatas);
        };
        /**
         * Gets all validator constraints for the given object.
         */
        MetadataStorage.prototype.getTargetValidatorConstraints = function (target) {
            return this.constraintMetadatas.filter(function (metadata) { return metadata.target === target; });
        };
        return MetadataStorage;
    }());
    /**
     * Gets metadata storage.
     * Metadata storage follows the best practices and stores metadata in a global variable.
     */
    function getMetadataStorage() {
        var global = getGlobal();
        if (!global.classValidatorMetadataStorage) {
            global.classValidatorMetadataStorage = new MetadataStorage$1();
        }
        return global.classValidatorMetadataStorage;
    }

    /**
     * Validation types.
     */
    var ValidationTypes = /** @class */ (function () {
        function ValidationTypes() {
        }
        /**
         * Checks if validation type is valid.
         */
        ValidationTypes.isValid = function (type) {
            var _this = this;
            return (type !== 'isValid' &&
                type !== 'getMessage' &&
                Object.keys(this)
                    .map(function (key) { return _this[key]; })
                    .indexOf(type) !== -1);
        };
        /* system */
        ValidationTypes.CUSTOM_VALIDATION = 'customValidation'; // done
        ValidationTypes.NESTED_VALIDATION = 'nestedValidation'; // done
        ValidationTypes.PROMISE_VALIDATION = 'promiseValidation'; // done
        ValidationTypes.CONDITIONAL_VALIDATION = 'conditionalValidation'; // done
        ValidationTypes.WHITELIST = 'whitelistValidation'; // done
        ValidationTypes.IS_DEFINED = 'isDefined'; // done
        return ValidationTypes;
    }());

    /**
     * Container to be used by this library for inversion control. If container was not implicitly set then by default
     * container simply creates a new instance of the given class.
     */
    var defaultContainer = new (/** @class */ (function () {
        function class_1() {
            this.instances = [];
        }
        class_1.prototype.get = function (someClass) {
            var instance = this.instances.find(function (instance) { return instance.type === someClass; });
            if (!instance) {
                instance = { type: someClass, object: new someClass() };
                this.instances.push(instance);
            }
            return instance.object;
        };
        return class_1;
    }()))();
    /**
     * Gets the IOC container used by this library.
     */
    function getFromContainer(someClass) {
        return defaultContainer.get(someClass);
    }

    /**
     * This metadata interface contains information for custom validators.
     */
    var ConstraintMetadata = /** @class */ (function () {
        // -------------------------------------------------------------------------
        // Constructor
        // -------------------------------------------------------------------------
        function ConstraintMetadata(target, name, async) {
            if (async === void 0) { async = false; }
            this.target = target;
            this.name = name;
            this.async = async;
        }
        Object.defineProperty(ConstraintMetadata.prototype, "instance", {
            // -------------------------------------------------------------------------
            // Accessors
            // -------------------------------------------------------------------------
            /**
             * Instance of the target custom validation class which performs validation.
             */
            get: function () {
                return getFromContainer(this.target);
            },
            enumerable: false,
            configurable: true
        });
        return ConstraintMetadata;
    }());

    /**
     * Registers a custom validation decorator.
     */
    function registerDecorator(options) {
        var constraintCls;
        if (options.validator instanceof Function) {
            constraintCls = options.validator;
            var constraintClasses = getFromContainer(MetadataStorage$1).getTargetValidatorConstraints(options.validator);
            if (constraintClasses.length > 1) {
                throw "More than one implementation of ValidatorConstraintInterface found for validator on: " + options.target.name + ":" + options.propertyName;
            }
        }
        else {
            var validator_1 = options.validator;
            constraintCls = /** @class */ (function () {
                function CustomConstraint() {
                }
                CustomConstraint.prototype.validate = function (value, validationArguments) {
                    return validator_1.validate(value, validationArguments);
                };
                CustomConstraint.prototype.defaultMessage = function (validationArguments) {
                    if (validator_1.defaultMessage) {
                        return validator_1.defaultMessage(validationArguments);
                    }
                    return '';
                };
                return CustomConstraint;
            }());
            getMetadataStorage().addConstraintMetadata(new ConstraintMetadata(constraintCls, options.name, options.async));
        }
        var validationMetadataArgs = {
            type: options.name && ValidationTypes.isValid(options.name) ? options.name : ValidationTypes.CUSTOM_VALIDATION,
            target: options.target,
            propertyName: options.propertyName,
            validationOptions: options.options,
            constraintCls: constraintCls,
            constraints: options.constraints,
        };
        getMetadataStorage().addValidationMetadata(new ValidationMetadata(validationMetadataArgs));
    }

    function buildMessage(impl, validationOptions) {
        return function (validationArguments) {
            var eachPrefix = validationOptions && validationOptions.each ? 'each value in ' : '';
            return impl(eachPrefix, validationArguments);
        };
    }
    function ValidateBy(options, validationOptions) {
        return function (object, propertyName) {
            registerDecorator({
                name: options.name,
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                constraints: options.constraints,
                validator: options.validator,
            });
        };
    }

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    /**
     * Objects / object arrays marked with this decorator will also be validated.
     */
    function ValidateNested(validationOptions) {
        var opts = __assign({}, validationOptions);
        var eachPrefix = opts.each ? 'each value in ' : '';
        opts.message = opts.message || eachPrefix + 'nested property $property must be either object or array';
        return function (object, propertyName) {
            var args = {
                type: ValidationTypes.NESTED_VALIDATION,
                target: object.constructor,
                propertyName: propertyName,
                validationOptions: opts,
            };
            getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
        };
    }

    var IS_STRING = 'isString';
    /**
     * Checks if a given value is a real string.
     */
    function isString(value) {
        return value instanceof String || typeof value === 'string';
    }
    /**
     * Checks if a given value is a real string.
     */
    function IsString(validationOptions) {
        return ValidateBy({
            name: IS_STRING,
            validator: {
                validate: function (value, args) { return isString(value); },
                defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be a string'; }, validationOptions),
            },
        }, validationOptions);
    }

    var MySubClassDto = /** @class */ (function () {
        function MySubClassDto() {
        }
        __decorate([
            IsString(),
            __metadata("design:type", String)
        ], MySubClassDto.prototype, "name", void 0);
        return MySubClassDto;
    }());
    var MyClassDto = /** @class */ (function () {
        function MyClassDto() {
        }
        __decorate([
            IsString(),
            __metadata("design:type", String)
        ], MyClassDto.prototype, "id", void 0);
        __decorate([
            Type(function () { return MySubClassDto; }),
            ValidateNested(),
            __metadata("design:type", MySubClassDto)
        ], MyClassDto.prototype, "child", void 0);
        return MyClassDto;
    }());

    exports.MyClassDto = MyClassDto;
    exports.MySubClassDto = MySubClassDto;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=my-lib.umd.js.map
