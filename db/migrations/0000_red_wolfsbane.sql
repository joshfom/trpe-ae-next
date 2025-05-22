CREATE TYPE "public"."employee_type" AS ENUM('agent', 'admin', 'manager');--> statement-breakpoint
CREATE TYPE "public"."import_job_types" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."property_completion_status" AS ENUM('offplan_primary', 'offplan_secondary', 'ready_primary', 'ready_secondary');--> statement-breakpoint
CREATE TYPE "public"."property_availability" AS ENUM('available', 'unavailable', 'sold', 'rented', 'off_market', 'under_offer', 'others');--> statement-breakpoint
CREATE TYPE "public"."property_furnished" AS ENUM('furnished', 'unfurnished', 'semi_furnished');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('draft', 'published', 'unpublished', 'deleted');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"model_id" text,
	"model_type" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_languages" (
	"id" text PRIMARY KEY NOT NULL,
	"agentId" text NOT NULL,
	"languageId" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"slug" text,
	"icon" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assigned_owners" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text,
	"property_owner_id" text,
	"name" text,
	"address" text,
	"mobile" text,
	"resident_country" text,
	"secondary_mobile" text,
	"national" text,
	"created_by" text,
	"updated_by" text,
	"assigned_to" text,
	"secondary_phone" text,
	"area_owned" text,
	"plot_number" text,
	"total_area" text,
	"usage_type" text,
	"project" text,
	"master_project" text,
	"municipality_number" text,
	"floors" text,
	"common_area" text,
	"parking_area" text,
	"balcony_area" text,
	"flat_number" text,
	"registration_number" text,
	"building_name" text,
	"area" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"about" text,
	"avatar" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "buildings" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text,
	"name" text,
	"type" text,
	"about" text,
	"bedrooms" integer,
	"longitudes" real,
	"latitudes" real,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"longitude" text,
	"latitude" text,
	"country_id" text,
	"short_name" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"commentable_id" text,
	"commentable_type" text,
	"user_id" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"is_public" boolean DEFAULT true,
	"meta_desc" text,
	"meta_title" text,
	"meta_keywords" text,
	"about" text,
	"city_id" text,
	"label" text,
	"longitude" text,
	"latitude" text,
	"image" text,
	"short_name" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "communities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	"address" text,
	"mobile" text,
	"imported" boolean DEFAULT false,
	"created_by" text,
	"updated_by" text,
	"assigned_to" text,
	"secondary_phone" text,
	"residence" text,
	"national" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"longitude" text,
	"latitude" text,
	"short_name" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "countries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "developers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"logo_url" text,
	"order" integer DEFAULT 100,
	"short_name" text,
	"website" text,
	"featured_image" text,
	"about" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "developers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "developments" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"bedrooms" text,
	"bathrooms" text,
	"build_year" text,
	"slug" text NOT NULL,
	"price" text,
	"completion_status" text,
	"developer_id" text,
	"community_id" text,
	"city_id" text,
	"offering_type_id" text,
	"property_type_id" text,
	"longitude" text,
	"latitude" text,
	"cheques" text,
	"floor" text,
	"availability_date" timestamp,
	"parking" text,
	"furnished" text,
	"reference_number" text,
	"sub_community" text,
	"service_charge" text,
	"size" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "developments_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "email_verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_id" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_verifications_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"slug" text NOT NULL,
	"title" text,
	"last_name" text,
	"order" integer DEFAULT 100,
	"type" "employee_type" DEFAULT 'agent',
	"is_visible" boolean DEFAULT false,
	"user_id" text,
	"avatar_url" text,
	"is_active" text DEFAULT 'false',
	"team_id" text,
	"bio" text,
	"rera" text,
	"phone" text,
	"email" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"icon" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text,
	"image_url" text,
	"answer" text,
	"target_id" text,
	"target_model" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "floor_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text,
	"url" text,
	"order" integer DEFAULT 0,
	"file_type" text DEFAULT 'image',
	"name" text,
	"type" text,
	"bedrooms" integer,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "import_job_types" DEFAULT 'pending',
	"property_count" integer,
	"imported_count" integer,
	"updated_count" integer,
	"failed_count" integer,
	"failed_properties" jsonb,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insights" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"cover_url" text,
	"author" text,
	"about_author" text,
	"community_id" text,
	"sub_community_id" text,
	"alt_text" text,
	"meta_description" text,
	"meta_title" text,
	"city_id" text,
	"developer_id" text,
	"content" text,
	"development_id" text,
	"is_published" text,
	"published_at" timestamp with time zone,
	"agent_id" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "insights_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"icon" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text NOT NULL,
	"message" text,
	"source" text,
	"property_id" text,
	"agent_id" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"model_id" text NOT NULL,
	"model_type" text NOT NULL,
	"name" text NOT NULL,
	"file_name" text NOT NULL,
	"url" text NOT NULL,
	"disk" text,
	"collection_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" text NOT NULL,
	"manipulations" jsonb,
	"custom_properties" jsonb,
	"responsive_images" jsonb,
	"order_column" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"content" text,
	"user_id" text,
	"notetable_id" text,
	"notetable_type" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"short_name" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offer_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "offering_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"meta_title" text,
	"meta_description" text,
	"page_title" text,
	"about" text,
	"short_name" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offering_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "offplan_facilities" (
	"id" text PRIMARY KEY NOT NULL,
	"offplan_id" text,
	"facility_id" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offplan_images" (
	"id" text PRIMARY KEY NOT NULL,
	"offplan_id" text,
	"url" text,
	"order" integer DEFAULT 0,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offplans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"about" text,
	"build_year" text,
	"floors" integer,
	"brochure_url" text,
	"slug" text NOT NULL,
	"handover_date" timestamp,
	"from_size" integer,
	"to_size" integer,
	"from_price" integer,
	"payment_title" text,
	"to_price" integer,
	"completion_status" text,
	"developer_id" text,
	"community_id" text,
	"qr_code" text,
	"building_id" text,
	"longitude" real,
	"latitude" real,
	"permit_number" text,
	"availability_date" timestamp,
	"sub_community" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offplans_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "payment_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"offplan_id" text,
	"title" text,
	"percentage" integer,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_properties" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text,
	"portal_id" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portals" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"description" text,
	"frequency" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_amenities" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"icon" text,
	"amenity_id" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text,
	"crm_url" text,
	"s3_url" text,
	"order" integer DEFAULT 0,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_owners" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"building_name" text,
	"phone" text,
	"address" text,
	"mobile" text,
	"resident_country" text,
	"secondary_mobile" text,
	"nationality" text,
	"addedBy" text,
	"updated_by" text,
	"secondary_phone" text,
	"area_owned" text,
	"plot_number" text,
	"total_area" text,
	"usage_type" text,
	"project" text,
	"master_project" text,
	"municipality_number" text,
	"common_area" text,
	"parking_area" text,
	"balcony_area" text,
	"unit_number" text,
	"registration_number" text,
	"procedure_number" text,
	"size" text,
	"room_type" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"name" text,
	"description" text,
	"bedrooms" integer,
	"bathrooms" integer,
	"build_year" text,
	"agent_id" text,
	"slug" text NOT NULL,
	"price" integer,
	"completion_status" text,
	"developer_id" text,
	"community_id" text,
	"city_id" text,
	"offering_type_id" text,
	"unit_type_id" text,
	"type_id" text,
	"longitude" text,
	"latitude" text,
	"cheques" text,
	"imported" boolean DEFAULT false,
	"floor" text,
	"permit_number" text,
	"plot_size" integer,
	"availability_date" timestamp,
	"availability" "property_availability" DEFAULT 'unavailable',
	"status" "property_status" DEFAULT 'draft',
	"offplan_completion_status" "property_completion_status",
	"furnished" text,
	"parking" text,
	"reference_number" text,
	"sub_community" text,
	"service_charge" text,
	"size" integer,
	"last_updated" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"rent_meta_title" text,
	"rent_meta_description" text,
	"sale_meta_title" text,
	"sale_meta_description" text,
	"sale_content" jsonb,
	"rent_content" jsonb,
	"rent_h1" text,
	"sale_h1" text,
	"short_name" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "property_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "redirects" (
	"id" text PRIMARY KEY NOT NULL,
	"from_url" text NOT NULL,
	"to_url" text,
	"status_code" text NOT NULL,
	"is_active" text DEFAULT 'yes',
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "redirects_from_url_unique" UNIQUE("from_url")
);
--> statement-breakpoint
CREATE TABLE "sub_communities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"label" text,
	"community_id" text,
	"longitude" text,
	"latitude" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sub_communities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"leader_id" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unit_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"short_name" text,
	"slug" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unit_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"avatar_url" text,
	"username" text,
	"is_active" boolean DEFAULT false,
	"password" text,
	"google_id" text,
	"github_id" text,
	"verified_at" timestamp with time zone,
	"email" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_id_employees_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;