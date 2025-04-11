import { Static, t } from "elysia";
import { db } from "../db";
import { factorValues } from "../db/schema";
import { and, eq } from "drizzle-orm";

export enum FactorValueTypeEnum {
	OntologyAnnotation = "ontologyAnnotation",
	String = "string",
	Number = "number",
}

export const FactorValue = t.Object({
	category: t.Optional(t.String()),
	factorValueType: t.Optional(
		t.Union([
			t.Literal(FactorValueTypeEnum.OntologyAnnotation),
			t.Literal(FactorValueTypeEnum.String),
			t.Literal(FactorValueTypeEnum.Number),
		]),
	),
	ontologyValue: t.Optional(t.String()), // this is a UUID string
	stringValue: t.Optional(t.String()),
	numValue: t.Optional(t.Number()),
	unit: t.Optional(t.String()),
});

export type TFactorValue = Static<typeof FactorValue>;

export async function createFactorValue(data: TFactorValue, factorId: string) {
	const currentTime = new Date();

	return await db
		.insert(factorValues)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			factor: factorId,
		})
		.returning();
}

export async function getAllFactorValues(factorId: string) {
	return await db.query.factorValues.findMany({
		where: eq(factorValues.factor, factorId),
	});
}

export async function getFactorValueById(
	factorId: string,
	factorValueId: string,
) {
	return await db.query.factorValues.findFirst({
		where: and(
			eq(factorValues.factor, factorId),
			eq(factorValues.id, factorValueId),
		),
	});
}

export async function editFactorValue(
	data: TFactorValue,
	factorValueId: string,
) {
	const currentTime = new Date();

	return await db
		.update(factorValues)
		.set({ ...data, updatedAt: currentTime })
		.where(eq(factorValues.id, factorValueId))
		.returning();
}

export async function deleteFactorValue(factorValueId: string) {
	await db.delete(factorValues).where(eq(factorValues.id, factorValueId));
}
