"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const scenariosRoutor = express.Router();
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
const removeData = () => {
    try {
        fs_1.default.unlinkSync("data.json");
    }
    catch (err) {
        console.error("Error removing data:", err);
    }
};
// Load data on server start
loadData();
// GET endpoint for fetching all scenarios with vehicle count
scenariosRoutor.get("/", (req, res) => {
    // Assuming loadData() loads data into the application
    // loadData();
    // Map scenarios to include their ID
    const scenarios = data.scenarios.map((scenario) => ({
        id: scenario.id,
        name: scenario.name,
        time: scenario.time,
        // Add more fields as needed
    }));
    // Calculate the number of vehicles for each scenario
    const scenariosWithVehicleCount = scenarios.map((scenario) => {
        const vehicleCount = data.vehicles.filter((vehicle) => vehicle.scenarioId === scenario.id).length;
        return Object.assign(Object.assign({}, scenario), { vehicleCount });
    });
    res.json(scenariosWithVehicleCount);
});
// GET by id endpoint for fetching a scenario
scenariosRoutor.get("/:id", (req, res) => {
    const { id } = req.params;
    const scenario = data.scenarios.find((scenario) => scenario.id === id);
    if (!scenario) {
        return res.status(404).json({ error: "Scenario not found." });
    }
    res.json(scenario);
});
// POST endpoint for creating a scenario
scenariosRoutor.post("/", (req, res) => {
    try {
        const { name, time } = req.body;
        // Check if name and time are provided
        if (!name || !time) {
            return res
                .status(400)
                .json({ error: "Name and time are required fields." });
        }
        // Generate a unique ID for the scenario
        const id = (0, uuid_1.v4)();
        const createdAt = new Date();
        const updatedAt = createdAt;
        const scenario = {
            id,
            name,
            time,
            createdAt,
            updatedAt,
        };
        data.scenarios.push(scenario);
        saveData();
        res.status(201).json(scenario);
    }
    catch (error) {
        console.error("Error creating scenario:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
// PUT endpoint for updating a scenario
scenariosRoutor.put("/:id", (req, res) => {
    const { id } = req.params;
    const updatedScenario = req.body;
    data.scenarios = data.scenarios.map((scenario) => {
        if (scenario.id === id) {
            return Object.assign(Object.assign({}, scenario), updatedScenario);
        }
        return scenario;
    });
    saveData();
    res.json(updatedScenario);
});
// DELETE endpoint for deleting a scenario
scenariosRoutor.delete("/:id", (req, res) => {
    const { id } = req.params;
    data.scenarios = data.scenarios.filter((scenario) => scenario.id !== id);
    saveData();
    res.sendStatus(200).send("Scenario deleted");
});
scenariosRoutor.post("/all", (req, res) => {
    data.scenarios = [];
    saveData();
    res.json({
        message: "All scenarios deleted",
        data,
    });
});
exports.default = scenariosRoutor;
//# sourceMappingURL=scenarios.js.map