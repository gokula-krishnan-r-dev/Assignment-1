"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const vehiclesRouter = express.Router();
let data = {
    scenarios: [],
    vehicles: [],
};
const loadData = () => {
    try {
        if (fs_1.default.existsSync("data.json")) {
            const jsonData = fs_1.default.readFileSync("data.json");
            data = JSON.parse(jsonData);
        }
        else {
            console.log("Data file does not exist. Initializing with empty data.");
        }
    }
    catch (err) {
        console.error("Error loading data:", err);
    }
};
const saveData = () => {
    try {
        fs_1.default.writeFileSync("data.json", JSON.stringify(data));
    }
    catch (err) {
        console.error("Error saving data:", err);
    }
};
// Load data on server start
loadData();
vehiclesRouter.get("/", (req, res) => {
    try {
        res.json(data.vehicles);
    }
    catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
vehiclesRouter.get("/:id", (req, res) => {
    try {
        const { id } = req.params;
        // Find the vehicle by ID
        const vehicle = data.vehicles.find((vehicle) => vehicle.id === id);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found." });
        }
        res.json(vehicle);
    }
    catch (error) {
        console.error("Error fetching vehicle:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
// POST endpoint for creating a vehicle
vehiclesRouter.post("", (req, res) => {
    try {
        const { name, initialPositionX, initialPositionY, speed, direction, scenarioId, } = req.body;
        // Validate input data
        if (!name ||
            !initialPositionX ||
            !initialPositionY ||
            !speed ||
            !direction ||
            !scenarioId) {
            return res.status(400).json({
                error: "Name, initial position X and Y, speed, and direction are required fields.",
            });
        }
        // Generate a unique ID for the vehicle
        const id = (0, uuid_1.v4)();
        const createdAt = new Date();
        const updatedAt = createdAt;
        const vehicle = {
            id,
            name,
            initialPositionX,
            initialPositionY,
            speed,
            direction,
            scenarioId,
            createdAt,
            updatedAt,
        };
        data.vehicles.push(vehicle);
        saveData();
        res.status(201).json(vehicle);
    }
    catch (error) {
        console.error("Error creating vehicle:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
// PUT endpoint for updating a vehicle
vehiclesRouter.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, initialPositionX, initialPositionY, speed, direction } = req.body;
        // Find the vehicle by ID
        const vehicleIndex = data.vehicles.findIndex((vehicle) => vehicle.id === id);
        if (vehicleIndex === -1) {
            return res.status(404).json({ error: "Vehicle not found." });
        }
        // Update the vehicle
        data.vehicles[vehicleIndex] = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, data.vehicles[vehicleIndex]), (name && { name })), (initialPositionX && { initialPositionX })), (initialPositionY && { initialPositionY })), (speed && { speed })), (direction && { direction }));
        saveData();
        res.json(data.vehicles[vehicleIndex]);
    }
    catch (error) {
        console.error("Error updating vehicle:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
// DELETE endpoint for deleting a vehicle
vehiclesRouter.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        // Filter out the vehicle to be deleted
        data.vehicles = data.vehicles.filter((vehicle) => vehicle.id !== id);
        saveData();
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = vehiclesRouter;
//# sourceMappingURL=vehicles.js.map