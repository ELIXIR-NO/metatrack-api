import { Static, t } from "elysia";
import { db } from "../db";
import { processParameterValues } from "../db/schema";
import { eq } from "drizzle-orm";

export enum ProcessParameterValueTypeEnum {
	OntologyAnnotation = "ontologyAnnotation",
	String = "string",
	Number = "number",
}

export const ProcessParameterValue = t.Object({
	category: t.Optional(t.String()),
	valueType: t.Optional(
		t.Union([
			t.Literal(ProcessParameterValueTypeEnum.OntologyAnnotation),
			t.Literal(ProcessParameterValueTypeEnum.String),
			t.Literal(ProcessParameterValueTypeEnum.Number),
		]),
	),
	ontologyValue: t.Optional(t.String()), // this is a UUID string
	stringValue: t.Optional(t.String()),
	numValue: t.Optional(t.Number()),
	unit: t.Optional(t.String()),
});

export type TProcessParameterValue = Static<typeof ProcessParameterValue>;

export async function createProcessParameterValue(
	data: TProcessParameterValue,
	processId: string,
) {
	const currentTime = new Date();

	return db.insert(processParameterValues).values({
		...data,
		createdAt: currentTime,
		updatedAt: currentTime,
		process: processId,
	});
}

export async function getAllProcessParameterValues(processId: string) {
	return db.query.processParameterValues.findMany({
		where: eq(processParameterValues.process, processId),
	});
}

export async function getProcessParameterValueById(
	processParameterValueId: string,
) {
	return db.query.processParameterValues.findFirst({
		where: eq(processParameterValues.id, processParameterValueId),
	});
}

export async function updateProcessParameterValue(
	data: TProcessParameterValue,
	processParameterValueId: string,
) {
	const currentTime = new Date();

	return db
		.update(processParameterValues)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(processParameterValues.id, processParameterValueId))
		.returning();
}

export async function deleteProcessParameterValue(
	processParameterValueId: string,
) {
	return db
		.delete(processParameterValues)
		.where(eq(processParameterValues.id, processParameterValueId));
}
