import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError } from "./errors.js";

const cuss = ["kerfuffle", "sharbert", "fornax"]

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;
  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140")
  }

  let words = params.body.split(' ')
  let cleanedBody: string[] = []

  words.forEach(word => {
    if (cuss.indexOf(word.toLowerCase()) > -1) {
        cleanedBody.push('****')
    } else {
        cleanedBody.push(word)
    }
  });

  respondWithJSON(res, 200, {
    cleanedBody: cleanedBody.join(' '),
  });
}