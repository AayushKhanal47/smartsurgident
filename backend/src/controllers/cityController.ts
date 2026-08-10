import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import City from "../models/City";

export const getCities = asyncHandler(async (_req: Request, res: Response) => {
  const cities = await City.find().sort({ name: 1 });
  res.json(cities);
});

export const createCity = asyncHandler(async (req: Request, res: Response) => {
  const city = await City.create(req.body);
  res.status(201).json(city);
});
