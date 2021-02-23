"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyClassDto = exports.MySubClassDto = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var MySubClassDto = /** @class */ (function () {
    function MySubClassDto() {
    }
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], MySubClassDto.prototype, "name", void 0);
    return MySubClassDto;
}());
exports.MySubClassDto = MySubClassDto;
var MyClassDto = /** @class */ (function () {
    function MyClassDto() {
    }
    __decorate([
        class_validator_1.IsString(),
        __metadata("design:type", String)
    ], MyClassDto.prototype, "id", void 0);
    __decorate([
        class_transformer_1.Type(function () { return MySubClassDto; }),
        class_validator_1.ValidateNested(),
        __metadata("design:type", MySubClassDto)
    ], MyClassDto.prototype, "child", void 0);
    return MyClassDto;
}());
exports.MyClassDto = MyClassDto;
//# sourceMappingURL=index.js.map