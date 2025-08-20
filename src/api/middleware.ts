import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";

export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction,
) {
    config.api.fileServerHits += 1
    next()
}

export function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.log(err.message);
  if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message);
  }
  if (err instanceof UnauthorizedError) {
    respondWithError(res, 401, err.message);
  }
  if (err instanceof ForbiddenError) {
    respondWithError(res, 403, err.message);
  }
  if (err instanceof NotFoundError) {
    respondWithError(res, 404, err.message);
  }
  respondWithError(res, 500, err.message);
}