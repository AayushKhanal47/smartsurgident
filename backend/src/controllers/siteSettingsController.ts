import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import SiteSettings from "../models/SiteSettings";

const DEFAULTS = { address: "Kathmandu, Nepal", phone: "01-4XXXXXX", email: "info@smartsurgident.com" };

export const getSiteSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await SiteSettings.findOne({ key: "singleton" });
  res.json(settings ?? DEFAULTS);
});

export const updateSiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const address = String(req.body.address ?? "").trim();
  const phone = String(req.body.phone ?? "").trim();
  const email = String(req.body.email ?? "").trim();

  const settings = await SiteSettings.findOneAndUpdate(
    { key: "singleton" },
    { key: "singleton", address, phone, email },
    { new: true, upsert: true }
  );
  res.json(settings);
});
