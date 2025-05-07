import { Static, t } from "elysia";
import { db } from "../db";
import { protocolComponents, protocols } from "../db/schema";
import { eq } from "drizzle-orm";

export const Protocol = t.Object({
	name: t.Optional(t.String()),
	protocolType: t.Optional(t.String()),
	description: t.Optional(t.String()),
	uri: t.Optional(t.String()),
	version: t.Optional(t.String()),
	parameters: t.Optional(t.Array(t.String())),
	components: t.Optional(t.String()),
});

export type TProtocol = Static<typeof Protocol>;

export async function createProtocol(data: TProtocol, investigationId: string) {
	const currentTime = new Date();

	return db
		.insert(protocols)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllProtocols(investigationId: string) {
	return db.query.protocols.findMany({
		where: eq(protocols.investigation, investigationId),
	});
}

export async function getProtocolById(protocolId: string) {
	return db.query.protocols.findFirst({ where: eq(protocols.id, protocolId) });
}

export async function updateProtocol(data: TProtocol, protocolId: string) {
	const currentTime = new Date();

	return db
		.update(protocols)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(protocols.id, protocolId))
		.returning();
}

export async function deleteProtocol(protocolId: string) {
	db.delete(protocols).where(eq(protocols.id, protocolId));
}
