import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const projects = pgTable("project", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text().notNull(),
	description: text(),
});

export const memberRoleEnum = pgEnum("member_role", [
	"owner",
	"admin",
	"writer",
	"reader",
	"pending",
]);

export const projectMember = pgTable("project_member", {
	id: uuid().defaultRandom().primaryKey(),
	role: memberRoleEnum(),
	memberId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	projectId: uuid()
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
});

export const projectMembersRelations = relations(projectMember, ({ one }) => ({
	memberId: one(user, {
		fields: [projectMember.memberId],
		references: [user.id],
	}),
	projectId: one(projects, {
		fields: [projectMember.projectId],
		references: [projects.id],
	}),
}));
