import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { 
    handlerFileServerHits, 
    handlerReadiness, 
    handlerResetFileServerHits,
} from "./api/readiness.js";
import { 
    middlewareLogResponse, 
    middlewareMetricsInc,
    errorHandler,
} from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/chirps.js";
import { handlerCreateUsers } from "./api/users.js";
import { config } from "./config.js";


const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponse);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req,res)).catch(next)
});

app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUsers(req, res)).catch(next)
});

app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerChirpsValidate(req, res)).catch(next)
});

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerFileServerHits(req, res)).catch(next)
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerResetFileServerHits(req, res)).catch(next)
});

app.use(errorHandler);
app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});
