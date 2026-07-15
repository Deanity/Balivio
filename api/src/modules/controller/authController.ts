import { Request, Response, NextFunction } from "express";
import * as authService from "../service/authService.js";
import { sendSuccess } from "../../utils/responseUtils.js";
import { AppError } from "../../utils/appError.js";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser = await authService.registerUser(req.body);
    sendSuccess(res, newUser, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    
    const loginResult = await authService.loginUser(req.body, ipAddress, userAgent);
    sendSuccess(res, loginResult, "Logged in successfully");
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const { refreshToken } = req.body;
    
    const refreshResult = await authService.refreshAccessToken(refreshToken, ipAddress, userAgent);
    sendSuccess(res, refreshResult, "Token refreshed successfully");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutUser(refreshToken);
    sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const profile = await authService.getUserProfile(req.user.userId);
    sendSuccess(res, profile, "Profile retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    await authService.changePassword(req.user.userId, req.body);
    sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const updatedProfile = await authService.updateUserProfile(req.user.userId, req.body);
    sendSuccess(res, updatedProfile, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};
