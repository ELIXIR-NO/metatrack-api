import { Static, t } from "elysia";
import { db } from "../db";
import { materialAttributeValues } from "../db/schema";
import { eq } from "drizzle-orm";

export enum MaterialAttributeValueTypeEnum {
	OntologyAnnotation = "ontologyAnnotation",
	String = "string",
	Number = "number",
}

export const MaterialAttributeValue = t.Object({
	category: t.Optional(t.String()),
	valueType: t.Optional(
		t.Union([
			t.Literal(MaterialAttributeValueTypeEnum.OntologyAnnotation),
			t.Literal(MaterialAttributeValueTypeEnum.String),
			t.Literal(MaterialAttributeValueTypeEnum.Number),
		]),
	),
	ontologyValue: t.Optional(t.String()),
	stringValue: t.Optional(t.String()),
	numValue: t.Optional(t.Number()),
	unit: t.Optional(t.String()),
});

export type TMaterialAttributeValue = Static<typeof MaterialAttributeValue>;

export async function createMaterialAttributeValue(
	data: TMaterialAttributeValue,
	investigationId: string,
) {
	const currentTime = new Date();

	return db
		.insert(materialAttributeValues)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllMaterialAttributeValues(investigationId: string) {
	return db.query.materialAttributeValues.findMany({
		where: eq(materialAttributeValues.investigation, investigationId),
	});
}

export async function getMaterialAttributeValueById(
	materialAttributeValueId: string,
) {
	return db.query.materialAttributeValues.findFirst({
		where: eq(materialAttributeValues.id, materialAttributeValueId),
	});
}

export async function updateMaterialAttributeValue(
	data: TMaterialAttributeValue,
	materialAttributeValueId: string,
) {
	const currentTime = new Date();

	return db
		.update(materialAttributeValues)
		.set({ ...data, updatedAt: currentTime })
		.where(eq(materialAttributeValues.id, materialAttributeValueId))
		.returning();
}

export async function deleteMaterialAttributeValue(
	materialAttributeValueId: string,
) {
	await db
		.delete(materialAttributeValues)
		.where(eq(materialAttributeValues.id, materialAttributeValueId));
}
