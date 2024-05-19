const express = require("express");
import fs from "fs";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const scenariosRoutor = express.Router();

interface Scenario {
  id: string;
  name: string;
  time: number;
  vehicleCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Data {
  scenarios: Scenario[];
  vehicles: Vehicle[];
}
interface Vehicle {
  id: string;
  name: string;
  initialPositionX: number;
  initialPositionY: number;
  speed: number;
  direction: "Towards" | "Backwards" | "Upwards" | "Downwards";
  scenarioId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

let data: Data = {
  scenarios: [],
  vehicles: [],
};

const loadData = () => {
  try {
    if (fs.existsSync("data.json")) {
      const jsonData: any = fs.readFileSync("data.json");
      data = JSON.parse(jsonData);
    } else {
      console.log("Data file does not exist. Initializing with empty data.");
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }
};

const saveData = () => {
  try {
    fs.writeFileSync("data.json", JSON.stringify(data));
  } catch (err) {
    console.error("Error saving data:", err);
  }
};

const removeData = () => {
  try {
    fs.unlinkSync("data.json");
  } catch (err) {
    console.error("Error removing data:", err);
  }
};

// Load data on server start
loadData();
// GET endpoint for fetching all scenarios with vehicle count
scenariosRoutor.get("/", (req: Request, res: Response) => {
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
    const vehicleCount = data.vehicles.filter(
      (vehicle) => vehicle.scenarioId === scenario.id
    ).length;
    return { ...scenario, vehicleCount };
  });

  res.json(scenariosWithVehicleCount);
});

// GET by id endpoint for fetching a scenario
scenariosRoutor.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const scenario = data.scenarios.find((scenario) => scenario.id === id);
  if (!scenario) {
    return res.status(404).json({ error: "Scenario not found." });
  }
  res.json(scenario);
});

// POST endpoint for creating a scenario
scenariosRoutor.post("/", (req: Request, res: Response) => {
  try {
    const { name, time } = req.body;

    // Check if name and time are provided
    if (!name || !time) {
      return res
        .status(400)
        .json({ error: "Name and time are required fields." });
    }

    // Generate a unique ID for the scenario
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    const scenario: Scenario = {
      id,
      name,
      time,
      createdAt,
      updatedAt,
    };

    data.scenarios.push(scenario);
    saveData();
    res.status(201).json(scenario);
  } catch (error) {
    console.error("Error creating scenario:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// PUT endpoint for updating a scenario
scenariosRoutor.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedScenario: Scenario = req.body;
  data.scenarios = data.scenarios.map((scenario: Scenario) => {
    if (scenario.id === id) {
      return { ...scenario, ...updatedScenario };
    }
    return scenario;
  });
  saveData();
  res.json(updatedScenario);
});

// DELETE endpoint for deleting a scenario
scenariosRoutor.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  data.scenarios = data.scenarios.filter(
    (scenario: Scenario) => scenario.id !== id
  );
  saveData();
  res.sendStatus(200).send("Scenario deleted");
});

scenariosRoutor.post("/all", (req: Request, res: Response) => {
  data.scenarios = [];
  saveData();
  res.json({
    message: "All scenarios deleted",
    data,
  });
});
export default scenariosRoutor;
