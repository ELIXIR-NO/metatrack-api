CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'writer', 'reader', 'pending');--> statement-breakpoint
CREATE TYPE "public"."dataType" AS ENUM('Raw Data File', 'Derived Data File', 'Image File');--> statement-breakpoint
CREATE TYPE "public"."material_type" AS ENUM('Extract Name', 'Labeled Extract Name');--> statement-breakpoint
CREATE TYPE "public"."process_input_type" AS ENUM('source', 'sample', 'data', 'material');--> statement-breakpoint
CREATE TYPE "public"."process_output_type" AS ENUM('sampele', 'data', 'material');--> statement-breakpoint
CREATE TYPE "public"."factor_value_type" AS ENUM('ontologyAnnotation', 'string', 'number');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "member_role",
	"memberId" text NOT NULL,
	"projectId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "assay_material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assay" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"filename" text,
	"study" uuid NOT NULL,
	"technologyPlatform" text,
	"materials" uuid,
	"measurementType" uuid,
	"technologyType" uuid
);
--> statement-breakpoint
CREATE TABLE "data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text,
	"dataType" "dataType",
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "factor_value" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"category" uuid,
	"factorValueType" "factor_value_type",
	"ontologyValue" uuid,
	"stringValue" text,
	"numValue" double precision,
	"unit" uuid,
	"factor" uuid
);
--> statement-breakpoint
CREATE TABLE "factor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"factorName" text,
	"factorType" uuid,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "investigation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"identifier" text NOT NULL,
	"title" text,
	"filename" text,
	"description" text,
	"submissionDate" date,
	"publicReleaseDate" date,
	"project" uuid,
	CONSTRAINT "investigation_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "material_attribute_value" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"category" uuid,
	"valueType" "factor_value_type",
	"ontologyValue" uuid,
	"stringValue" text,
	"numValue" double precision,
	"unit" uuid,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "material_attribute" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"characteristicType" uuid,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "material_derivations" (
	"materialId" uuid,
	"derivedFromId" uuid,
	CONSTRAINT "material_derivations_materialId_derivedFromId_pk" PRIMARY KEY("materialId","derivedFromId")
);
--> statement-breakpoint
CREATE TABLE "material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text,
	"type" "material_type",
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "ontology_annotation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"annotationValue" text,
	"termSource" uuid NOT NULL,
	"termAccession" text
);
--> statement-breakpoint
CREATE TABLE "ontology_source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"file" text,
	"version" text,
	"investigation" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"firstName" text,
	"lastName" text,
	"midInitials" text,
	"email" text,
	"phone" text,
	"fax" text,
	"address" text,
	"affiliation" text,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "process_input" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"inputType" "process_input_type",
	"sourceInput" uuid,
	"sampleinput" uuid,
	"dataInput" uuid,
	"materialInput" uuid
);
--> statement-breakpoint
CREATE TABLE "process_output" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"outputType" "process_output_type",
	"sampleOutput" uuid,
	"dataOutput" uuid,
	"materialOutput" uuid
);
--> statement-breakpoint
CREATE TABLE "process_parameter_value" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"category" uuid,
	"valueType" "factor_value_type",
	"ontologyValue" uuid,
	"stringValue" text,
	"numValue" double precision,
	"unit" uuid,
	"process" uuid
);
--> statement-breakpoint
CREATE TABLE "process" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text,
	"executesProtocol" uuid,
	"performer" text,
	"date" date,
	"previousProcess" uuid,
	"nextProcess" uuid,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "protocol_component" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"componentName" text,
	"componentType" uuid
);
--> statement-breakpoint
CREATE TABLE "protocol_parameter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"parameterName" uuid,
	"protocol" uuid
);
--> statement-breakpoint
CREATE TABLE "protocol" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text,
	"protocolType" uuid,
	"description" text,
	"uri" text,
	"version" text,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "publication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"pubMedID" text,
	"doi" text,
	"authorList" text,
	"title" text,
	"status" uuid,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "sample" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" text,
	"investigation" uuid
);
--> statement-breakpoint
CREATE TABLE "study" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"identifier" text NOT NULL,
	"title" text,
	"filename" text,
	"description" text,
	"submissionDate" date,
	"publicReleaseDate" date,
	"materials" uuid,
	"investigation" uuid NOT NULL,
	CONSTRAINT "study_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "study_material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_memberId_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assay" ADD CONSTRAINT "assay_study_study_id_fk" FOREIGN KEY ("study") REFERENCES "public"."study"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investigation" ADD CONSTRAINT "investigation_project_project_id_fk" FOREIGN KEY ("project") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_derivations" ADD CONSTRAINT "material_derivations_materialId_material_id_fk" FOREIGN KEY ("materialId") REFERENCES "public"."material"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_derivations" ADD CONSTRAINT "material_derivations_derivedFromId_material_id_fk" FOREIGN KEY ("derivedFromId") REFERENCES "public"."material"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ontology_annotation" ADD CONSTRAINT "ontology_annotation_termSource_ontology_source_id_fk" FOREIGN KEY ("termSource") REFERENCES "public"."ontology_source"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ontology_source" ADD CONSTRAINT "ontology_source_investigation_investigation_id_fk" FOREIGN KEY ("investigation") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study" ADD CONSTRAINT "study_investigation_investigation_id_fk" FOREIGN KEY ("investigation") REFERENCES "public"."investigation"("id") ON DELETE cascade ON UPDATE no action;