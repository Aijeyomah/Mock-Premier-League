"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_mongodb_errors_1 = __importDefault(require("mongoose-mongodb-errors"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const options = { timestamps: true };
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: 'Please Supply a first name!',
    },
    lastName: {
        type: String,
        required: 'Please Supply a last name!',
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please Supply an email address'],
    },
}, options);
userSchema.plugin(mongoose_unique_validator_1.default);
userSchema.plugin(mongoose_mongodb_errors_1.default);
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.js.map