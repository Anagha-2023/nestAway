"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const HomestaySchema = new mongoose_1.Schema({
    host: { type: mongoose_1.Schema.Types.ObjectId, ref: "Host", required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    pricePerNight: { type: Number, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    rooms: { type: Number, required: true },
    description: { type: String, required: true },
    services: [
        {
            name: { type: String, required: true },
            available: { type: Boolean, required: true },
        },
    ],
    cancellationPeriod: { type: Number, required: true },
    offerPercentage: { type: Number, default: 0 },
}, { timestamps: true });
const Homestay = mongoose_1.default.model('Homestay', HomestaySchema);
exports.default = Homestay;
