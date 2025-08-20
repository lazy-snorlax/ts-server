import type { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReadiness(_: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
  res.end();
}

export async function handlerFileServerHits(_: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
        <body>
          <h1>Welcome, Chirpy Admin</h1>
          <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
        </body>
      </html>`
  )
}

export async function handlerResetFileServerHits(_: Request, res: Response) {
  if (config.platform == "dev") {
    await deleteUsers();
    config.api.fileServerHits = 0;
    res.end();
  } else {
    throw new ForbiddenError("You are unauthorized")
  }
}
