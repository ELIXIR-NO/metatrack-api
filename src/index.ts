import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

import betterAuthView from "./utils/auth-view";
import { betterAuth } from "./middlewares/betterAuth";
import { handlers } from "./handlers";

const app = new Elysia()
	.use(
		cors({
			origin: "http://localhost:3001",
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(
		swagger({
			path: "/api/app/reference",
		}),
	)
	.use(handlers)
	.use(betterAuth)
	.all("/api/auth/*", betterAuthView)
	.get("/", () => {
		return {
			greetings: "This is the API for metatrack",
			auth_api: "https://api.metatrack.no/api/auth/reference",
			app_api: "https://api.metatrack.no/api/app/reference",
		};
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
