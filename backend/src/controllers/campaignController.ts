import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Campaign from "../models/Campaign";

export const getCampaigns = asyncHandler(async (req: Request, res: Response) => {
  const { placement } = req.query;
  const now = new Date();

  const filter: Record<string, unknown> = {
    isActive: true,
    $and: [
      { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
    ],
  };
  if (placement) filter.placement = placement;

  const campaigns = await Campaign.find(filter).populate("products");
  res.json(campaigns);
});

export const getAllCampaignsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).populate("products");
  res.json(campaigns);
});

export const getCampaignBySlug = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await Campaign.findOne({ slug: req.params.slug, isActive: true }).populate(
    "products"
  );
  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }
  res.json(campaign);
});

export const createCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await Campaign.create(req.body);
  res.status(201).json(campaign);
});

export const updateCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }
  res.json(campaign);
});

export const deleteCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await Campaign.findByIdAndDelete(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }
  res.json({ message: "Campaign removed" });
});
