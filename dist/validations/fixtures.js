"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixtureId = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
exports.fixtureId = joi_1.default.object().keys({
    fixtureId: joi_1.default.string()
        .required(),
});
//# sourceMappingURL=fixtures.js.map