import {
	date,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	primaryKey,
	doublePrecision,
} from "drizzle-orm/pg-core";
import { projects } from "./project-schema";

export const investigations = pgTable("investigation", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	identifier: text().notNull().unique(),
	title: text(),
	filename: text(),
	description: text(),
	submissionDate: date(),
	publicReleaseDate: date(),
	project: uuid().references(() => projects.id, { onDelete: "cascade" }),
});

export const studies = pgTable("study", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	identifier: text().notNull().unique(),
	title: text(),
	filename: text(),
	description: text(),
	submissionDate: date(),
	publicReleaseDate: date(),
	materials: uuid(),
	investigation: uuid()
		.notNull()
		.references(() => investigations.id, { onDelete: "cascade" }),
});

export const studyMaterials = pgTable("study_material", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	study: uuid().references(() => studies.id, { onDelete: "cascade" }),
});

export const assays = pgTable("assay", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	filename: text(),
	study: uuid()
		.notNull()
		.references(() => studies.id, { onDelete: "cascade" }),
	technologyPlatform: text(),
	materials: uuid(),
	measurementType: uuid(),
	technologyType: uuid(),
});

export const assayMaterials = pgTable("assay_material", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	assay: uuid().references(() => assays.id, { onDelete: "cascade" }),
});

export const dataTypeEnum = pgEnum("dataType", [
	"Raw Data File",
	"Derived Data File",
	"Image File",
]);

export const data = pgTable("data", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text(),
	dataType: dataTypeEnum(),
	investigation: uuid(),
});

export const factors = pgTable("factor", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	factorName: text(),
	factorType: uuid(),
	investigation: uuid(),
});

export const valueTypeEnum = pgEnum("factor_value_type", [
	"ontologyAnnotation",
	"string",
	"number",
]);

export const factorValues = pgTable("factor_value", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	category: uuid(),
	factorValueType: valueTypeEnum(),
	ontologyValue: uuid(),
	stringValue: text(),
	numValue: doublePrecision(),
	unit: uuid(),
	factor: uuid(),
});

export const materialAttributes = pgTable("material_attribute", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	characteristicType: uuid(),
	investigation: uuid(),
});

export const materialAttributeValues = pgTable("material_attribute_value", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	category: uuid(),
	valueType: valueTypeEnum(),
	ontologyValue: uuid(),
	stringValue: text(),
	numValue: doublePrecision(),
	unit: uuid(),
	investigation: uuid(),
});

export const materialTypeEnum = pgEnum("material_type", [
	"Extract Name",
	"Labeled Extract Name",
]);

export const materials = pgTable("material", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text(),
	type: materialTypeEnum(),
	investigation: uuid(),
});

export const materialDerivations = pgTable(
	"material_derivations",
	{
		materialId: uuid().references(() => materials.id, {
			onDelete: "cascade",
		}),
		derivedFromId: uuid().references(() => materials.id, {
			onDelete: "cascade",
		}),
	},
	(t) => [primaryKey({ columns: [t.materialId, t.derivedFromId] })],
);

export const ontologyAnnotations = pgTable("ontology_annotation", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	annotationValue: text(),
	termSource: uuid()
		.notNull()
		.references(() => ontologySources.id, { onDelete: "cascade" }),
	termAccession: text(),
});

export const ontologySources = pgTable("ontology_source", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text().notNull(),
	description: text(),
	file: text(),
	version: text(),
	investigation: uuid()
		.notNull()
		.references(() => investigations.id, { onDelete: "cascade" }),
});

export const people = pgTable("person", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	firstName: text(),
	lastName: text(),
	midInitials: text(),
	email: text(),
	phone: text(),
	fax: text(),
	address: text(),
	affiliation: text(),
	investigation: uuid(),
});

export const processParameterValues = pgTable("process_parameter_value", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	category: uuid(),
	valueType: valueTypeEnum(),
	ontologyValue: uuid(),
	stringValue: text(),
	numValue: doublePrecision(),
	unit: uuid(),
	process: uuid(),
});

export const processes = pgTable("process", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text(),
	executesProtocol: uuid(),
	performer: text(),
	date: date(),
	previousProcess: uuid(),
	nextProcess: uuid(),
	investigation: uuid(),
});

export const processInputTypeEnum = pgEnum("process_input_type", [
	"source",
	"sample",
	"data",
	"material",
]);

export const processInputs = pgTable("process_input", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	inputType: processInputTypeEnum(),
	sourceInput: uuid(),
	sampleinput: uuid(),
	dataInput: uuid(),
	materialInput: uuid(),
});

export const processOutputTypeEnum = pgEnum("process_output_type", [
	"sampele",
	"data",
	"material",
]);

export const processOutputs = pgTable("process_output", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	outputType: processOutputTypeEnum(),
	sampleOutput: uuid(),
	dataOutput: uuid(),
	materialOutput: uuid(),
});

export const protocolParameters = pgTable("protocol_parameter", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	parameterName: uuid(),
	protocol: uuid(),
});

export const protocols = pgTable("protocol", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text(),
	protocolType: uuid(),
	description: text(),
	uri: text(),
	version: text(),
	investigation: uuid(),
});

export const protocolComponents = pgTable("protocol_component", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	componentName: text(),
	componentType: uuid(),
});

export const publications = pgTable("publication", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	pubMedID: text(),
	doi: text(),
	authorList: text(),
	title: text(),
	status: uuid(),
	investigation: uuid(),
});

export const samples = pgTable("sample", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text(),
	investigation: uuid(),
});

export const sources = pgTable("source", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	name: text(),
	investigation: uuid(),
});
