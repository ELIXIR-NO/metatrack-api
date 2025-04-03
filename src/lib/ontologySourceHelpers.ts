import { Static, t } from "elysia";
import { db } from "../db";
import { ontologySources } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const OntologySourceReference = t.Object({
	description: t.Optional(t.String()),
	file: t.Optional(t.String()),
	name: t.String(),
	version: t.String(),
});

export type TCreateOntologySourceReference = Static<
	typeof OntologySourceReference
>;

export const EditOntologySourceReference = t.Omit(OntologySourceReference, [
	"name",
]);

export type TEditOntologSourceReference = Static<
	typeof EditOntologySourceReference
>;

export async function createOntology(
	data: TCreateOntologySourceReference,
	investigationId: string,
) {
	const currentTime = new Date();

	return await db.insert(ontologySources).values({
		...data,
		createdAt: currentTime,
		updatedAt: currentTime,
		investigation: investigationId,
	});
}

export async function getAllOntologies(investigationId: string) {
	return await db.query.ontologySources.findMany({
		where: eq(ontologySources.investigation, investigationId),
	});
}

export async function getOntologyById(
	investigationId: string,
	ontologyId: string,
) {
	return await db.query.ontologySources.findFirst({
		where: and(
			eq(ontologySources.investigation, investigationId),
			eq(ontologySources.id, ontologyId),
		),
	});
}

export async function updateOntology(
	data: TEditOntologSourceReference,
	investigationId: string,
	ontologyId: string,
) {
	const ontology = await getOntologyById(investigationId, ontologyId);
	if (!ontology) return undefined;

	const currentTime = new Date();
	return await db
		.update(ontologySources)
		.set({ ...data, updatedAt: currentTime })
		.where(eq(ontologySources.id, ontologyId));
}

export async function deleteOntolgy(
	investigationId: string,
	ontologyId: string,
) {
	const ontology = await getOntologyById(investigationId, ontologyId);
	if (!ontology) return undefined;

	await db
		.delete(ontologySources)
		.where(
			and(
				eq(ontologySources.investigation, investigationId),
				eq(ontologySources.id, ontologyId),
			),
		);
}
