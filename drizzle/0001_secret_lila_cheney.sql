ALTER TABLE "assay_material" ADD COLUMN "assay" uuid;--> statement-breakpoint
ALTER TABLE "study_material" ADD COLUMN "study" uuid;--> statement-breakpoint
ALTER TABLE "assay_material" ADD CONSTRAINT "assay_material_assay_assay_id_fk" FOREIGN KEY ("assay") REFERENCES "public"."assay"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_material" ADD CONSTRAINT "study_material_study_study_id_fk" FOREIGN KEY ("study") REFERENCES "public"."study"("id") ON DELETE cascade ON UPDATE no action;