import type { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUsers(req: Request, res: Response) {
    type parameters = { email: string };
    const params: parameters = req.body;
    if (!params.email) {
        throw new BadRequestError("No email detected in request body")
    }

    const response = await createUser({ email: params.email })
    if (!response) {
        throw new Error("Nothing returned from createUsers")
    }

    respondWithJSON(res, 201, {
        id: response.id,
        email: response.email,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
    })
}