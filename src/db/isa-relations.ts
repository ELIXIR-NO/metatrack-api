import { relations } from "drizzle-orm";
import {
	ontologySources,
	ontologyAnnotations,
	investigations,
	studies,
	assays,
	factors,
	factorValues,
	materialAttributes,
	materialAttributeValues,
	materials,
	materialDerivations,
	people,
	processParameterValues,
	protocolParameters,
	processes,
	protocols,
	processInputs,
	data,
	processOutputs,
	protocolComponents,
	publications,
	samples,
	sources,
	studyMaterials,
	assayMaterials,
	projects,
} from "./schema";

export const investigationsRelations = relations(
	investigations,
	({ one, many }) => ({
		ontologySourceReferences: many(ontologySources),
		publications: many(publications),
		people: many(people),
		studies: many(studies),
		project: one(projects, {
			fields: [investigations.project],
			references: [projects.id],
		}),
	}),
);

export const studyRelations = relations(studies, ({ one, many }) => ({
	investigation: one(investigations, {
		fields: [studies.investigation],
		references: [investigations.id],
	}),
	publications: many(publications),
	people: many(people),
	studyDesignDescriptors: many(ontologyAnnotations),
	protocols: many(protocols),
	processSequence: many(processes),
	assays: many(assays),
	factors: many(factors),
	characteristicCategories: many(materialAttributes),
	unitCategories: many(ontologyAnnotations),
	materials: one(studyMaterials, {
		fields: [studies.materials],
		references: [studyMaterials.id],
	}),
}));

export const studyMaterialRelations = relations(studyMaterials, ({ many }) => ({
	sources: many(sources),
	samples: many(samples),
	materials: many(materials),
}));

export const assayRelations = relations(assays, ({ one, many }) => ({
	study: one(studies, {
		fields: [assays.study],
		references: [studies.id],
	}),
	dataFiles: many(data),
	characteristicCategories: many(materialAttributes),
	measurementType: one(ontologyAnnotations, {
		fields: [assays.measurementType],
		references: [ontologyAnnotations.id],
	}),
	technologyType: one(ontologyAnnotations, {
		fields: [assays.technologyType],
		references: [ontologyAnnotations.id],
	}),
	unitCategories: many(ontologyAnnotations),
	processSequence: many(processes),
	materials: one(assayMaterials, {
		fields: [assays.materials],
		references: [assayMaterials.id],
	}),
}));

export const assayMaterialRelations = relations(assayMaterials, ({ many }) => ({
	samples: many(samples),
	materials: many(materials),
}));

export const dataRelations = relations(data, ({ one }) => ({
	investigation: one(investigations, {
		fields: [data.investigation],
		references: [investigations.id],
	}),
}));

export const factorRelations = relations(factors, ({ one }) => ({
	factoryType: one(ontologyAnnotations, {
		fields: [factors.factorType],
		references: [ontologyAnnotations.id],
	}),
	investigation: one(investigations, {
		fields: [factors.investigation],
		references: [investigations.id],
	}),
}));

export const factorValueRelations = relations(factorValues, ({ one }) => ({
	category: one(ontologyAnnotations, {
		fields: [factorValues.category],
		references: [ontologyAnnotations.id],
	}),
	ontologyValue: one(ontologyAnnotations, {
		fields: [factorValues.ontologyValue],
		references: [ontologyAnnotations.id],
	}),
	unit: one(ontologyAnnotations, {
		fields: [factorValues.unit],
		references: [ontologyAnnotations.id],
	}),
	investigation: one(factors, {
		fields: [factorValues.factor],
		references: [factors.id],
	}),
}));

export const materialAttributeRelations = relations(
	materialAttributes,
	({ one }) => ({
		characteristicType: one(ontologyAnnotations, {
			fields: [materialAttributes.characteristicType],
			references: [ontologyAnnotations.id],
		}),
		investigation: one(investigations, {
			fields: [materialAttributes.investigation],
			references: [investigations.id],
		}),
	}),
);

export const materialAttributeValueRelations = relations(
	materialAttributeValues,
	({ one }) => ({
		category: one(materialAttributes, {
			fields: [materialAttributeValues.category],
			references: [materialAttributes.id],
		}),
		ontologyValue: one(ontologyAnnotations, {
			fields: [materialAttributeValues.ontologyValue],
			references: [ontologyAnnotations.id],
		}),
		unit: one(ontologyAnnotations, {
			fields: [materialAttributeValues.unit],
			references: [ontologyAnnotations.id],
		}),
	}),
);

export const materialRelations = relations(materials, ({ many }) => ({
	characteristics: many(materialAttributeValues),
	derivesFrom: many(materialDerivations),
}));

export const materialDerivationRelations = relations(
	materialDerivations,
	({ one }) => ({
		materialId: one(materials, {
			fields: [materialDerivations.materialId],
			references: [materials.id],
		}),
		derivedFromId: one(materials, {
			fields: [materialDerivations.derivedFromId],
			references: [materials.id],
		}),
	}),
);

export const ontologyAnnotationRelations = relations(
	ontologyAnnotations,
	({ one }) => ({
		termSource: one(ontologySources, {
			fields: [ontologyAnnotations.termSource],
			references: [ontologySources.id],
		}),
	}),
);

export const ontologySourceRelations = relations(
	ontologySources,
	({ one, many }) => ({
		annotations: many(ontologyAnnotations),
		investigation: one(investigations, {
			fields: [ontologySources.investigation],
			references: [investigations.id],
		}),
	}),
);

export const peopleRelations = relations(people, ({ many }) => ({
	roles: many(ontologyAnnotations),
}));

export const processParameterValueRelations = relations(
	processParameterValues,
	({ one }) => ({
		category: one(protocolParameters, {
			fields: [processParameterValues.category],
			references: [protocolParameters.id],
		}),
		ontologyValue: one(ontologyAnnotations, {
			fields: [processParameterValues.ontologyValue],
			references: [ontologyAnnotations.id],
		}),
		unit: one(ontologyAnnotations, {
			fields: [processParameterValues.unit],
			references: [ontologyAnnotations.id],
		}),
	}),
);

export const processRelations = relations(processes, ({ one, many }) => ({
	executesProtocol: one(protocols, {
		fields: [processes.executesProtocol],
		references: [protocols.id],
	}),
	parameterValues: many(processParameterValues),
	previousProcess: one(processes, {
		fields: [processes.previousProcess],
		references: [processes.id],
	}),
	nextProcess: one(processes, {
		fields: [processes.nextProcess],
		references: [processes.id],
	}),
	inputs: many(processInputs),
	outputs: many(processOutputs),
}));

export const processInputRelations = relations(processInputs, ({ one }) => ({
	dataInput: one(data, {
		fields: [processInputs.dataInput],
		references: [data.id],
	}),
	materialInput: one(materials, {
		fields: [processInputs.materialInput],
		references: [materials.id],
	}),
	sourceInput: one(sources, {
		fields: [processInputs.sourceInput],
		references: [sources.id],
	}),
	sampleInput: one(samples, {
		fields: [processInputs.sampleinput],
		references: [samples.id],
	}),
}));

export const processOutputRelations = relations(processOutputs, ({ one }) => ({
	dataOutput: one(data, {
		fields: [processOutputs.dataOutput],
		references: [data.id],
	}),
	materialOutput: one(materials, {
		fields: [processOutputs.materialOutput],
		references: [materials.id],
	}),
	sampleOutput: one(samples, {
		fields: [processOutputs.sampleOutput],
		references: [samples.id],
	}),
}));

export const protocolParameterRelations = relations(
	protocolParameters,
	({ one }) => ({
		parameterName: one(ontologyAnnotations, {
			fields: [protocolParameters.parameterName],
			references: [ontologyAnnotations.id],
		}),
	}),
);

export const protocolRelations = relations(protocols, ({ one, many }) => ({
	protocolType: one(ontologyAnnotations, {
		fields: [protocols.protocolType],
		references: [ontologyAnnotations.id],
	}),
	parameters: many(protocolParameters),
	components: many(protocolComponents),
}));

export const protocolComponentsRelations = relations(
	protocolComponents,
	({ one }) => ({
		componentType: one(ontologyAnnotations, {
			fields: [protocolComponents.componentType],
			references: [ontologyAnnotations.id],
		}),
	}),
);

export const publicationRelations = relations(publications, ({ one }) => ({
	status: one(ontologyAnnotations, {
		fields: [publications.status],
		references: [ontologyAnnotations.id],
	}),
}));

export const sampleRelations = relations(samples, ({ many }) => ({
	characteristics: many(materialAttributeValues),
	factorValues: many(factorValues),
	derivesFrom: many(sources),
}));

export const sourceRelations = relations(sources, ({ many }) => ({
	characteristics: many(materialAttributeValues),
}));
