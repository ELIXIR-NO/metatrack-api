import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import betterAuthView from "./utils/auth-view";
import { betterAuth } from "./middlewares/betterAuth";
import { auth } from "./utils/auth";

const app = new Elysia()
	.use(
		swagger({
			path: "/api/app/reference",
		}),
	)
	.use(betterAuth)
	.all("/api/auth/*", betterAuthView)
	.get("/", () => "Hello Elysia")
	.listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
