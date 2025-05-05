import { Static, t } from "elysia";
import { protocolParameters } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const ProtocolParameter = t.Object({
	parameterName: t.Optional(t.String()),
});

export type TProtocolParameter = Static<typeof ProtocolParameter>;

export async function createProtocolParameter(
	data: TProtocolParameter,
	protocolId: string,
) {
	const currentTime = new Date();

	return db
		.insert(protocolParameters)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			protocol: protocolId,
		})
		.returning();
}

export async function getAllProtocolParmaters(protocolId: string) {
	return db.query.protocolParameters.findMany({
		where: eq(protocolParameters.protocol, protocolId),
	});
}

export async function getProtocolParameterById(protocolParameterId: string) {
	return db.query.protocolParameters.findFirst({
		where: eq(protocolParameters.id, protocolParameterId),
	});
}

export async function updateProtocolParameter(
	data: TProtocolParameter,
	protocolParameterId: string,
) {
	const currentTime = new Date();
	return db
		.update(protocolParameters)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(protocolParameters.id, protocolParameterId))
		.returning();
}

export async function deleteProtocolParameter(protocolParameterId: string) {
	db.delete(protocolParameters).where(
		eq(protocolParameters.id, protocolParameterId),
	);
}
