"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCity = exports.getCities = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const City_1 = __importDefault(require("../models/City"));
exports.getCities = (0, express_async_handler_1.default)(async (_req, res) => {
    const cities = await City_1.default.find().sort({ name: 1 });
    res.json(cities);
});
exports.createCity = (0, express_async_handler_1.default)(async (req, res) => {
    const city = await City_1.default.create(req.body);
    res.status(201).json(city);
});
