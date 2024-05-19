const express = require("express");
import fs from "fs";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
const vehiclesRouter = express.Router();
interface Scenario {
  id: string;
  name: string;
  time: number;
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

// Load data on server start
loadData();

vehiclesRouter.get("/", (req: Request, res: Response) => {
  try {
    res.json(data.vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

vehiclesRouter.get("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the vehicle by ID
    const vehicle = data.vehicles.find((vehicle) => vehicle.id === id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST endpoint for creating a vehicle
vehiclesRouter.post("", (req: Request, res: Response) => {
  try {
    const {
      name,
      initialPositionX,
      initialPositionY,
      speed,
      direction,
      scenarioId,
    } = req.body;

    // Validate input data
    if (
      !name ||
      !initialPositionX ||
      !initialPositionY ||
      !speed ||
      !direction ||
      !scenarioId
    ) {
      return res.status(400).json({
        error:
          "Name, initial position X and Y, speed, and direction are required fields.",
      });
    }

    // Generate a unique ID for the vehicle
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    const vehicle: Vehicle = {
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
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// PUT endpoint for updating a vehicle
vehiclesRouter.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, initialPositionX, initialPositionY, speed, direction } =
      req.body;

    // Find the vehicle by ID
    const vehicleIndex = data.vehicles.findIndex(
      (vehicle) => vehicle.id === id
    );
    if (vehicleIndex === -1) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    // Update the vehicle
    data.vehicles[vehicleIndex] = {
      ...data.vehicles[vehicleIndex],
      ...(name && { name }),
      ...(initialPositionX && { initialPositionX }),
      ...(initialPositionY && { initialPositionY }),
      ...(speed && { speed }),
      ...(direction && { direction }),
    };

    saveData();
    res.json(data.vehicles[vehicleIndex]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// DELETE endpoint for deleting a vehicle
vehiclesRouter.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Filter out the vehicle to be deleted
    data.vehicles = data.vehicles.filter((vehicle) => vehicle.id !== id);

    saveData();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default vehiclesRouter;
