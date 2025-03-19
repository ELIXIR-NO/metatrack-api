import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { account, session, user, verification } from "../db/schema/auth-schema";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user,
			session,
			verification,
			account,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [openAPI()],
});

export const betterAuthOpenAPI = await auth.api.generateOpenAPISchema();
