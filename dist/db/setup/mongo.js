"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("../../config/env"));
const MONGO_URI = env_1.default.DATABASE_URL;
const db = () => {
    try {
        const db = mongoose_1.default.connect(MONGO_URI);
        console.log('connected to db');
        return db;
    }
    catch (error) {
    }
};
exports.db = db;
//# sourceMappingURL=mongo.js.map