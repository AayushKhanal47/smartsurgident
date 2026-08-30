import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import Dealer from "../models/Dealer";

interface JwtPayload {
  id: string;
  type: "user" | "dealer";
}

// Extend Express's Request type so req.user / req.dealer are typed downstream
declare global {
  namespace Express {
    interface Request {
      user?: any;
      dealer?: any;
    }
  }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.cookies?.dealerToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (decoded.type === "dealer") {
      req.dealer = await Dealer.findById(decoded.id).select("-password");
    } else {
      req.user = await User.findById(decoded.id).select("-password");
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token invalid");
  }
});

// Orders may be placed by guests, but an authenticated customer must be
// identified when applying account-specific pricing.
export const optionalProtect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (decoded.type === "user") {
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch {
    // A guest checkout must not fail because a stale browser cookie exists.
  }

  next();
});

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin access only");
  }
  next();
};

export const dealerOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.dealer) {
    res.status(403);
    throw new Error("Dealer access only");
  }
  next();
};
