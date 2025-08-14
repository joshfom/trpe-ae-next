import { pgTable, text, timestamp, integer, uniqueIndex, boolean, bigint, foreignKey, real, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const importJobTypes = pgEnum("import_job_types", ['pending', 'running', 'completed', 'failed'])
export const propertyAvailability = pgEnum("property_availability", ['available', 'unavailable', 'sold', 'rented', 'off_market', 'under_offer', 'others'])
export const propertyCompletionStatus = pgEnum("property_completion_status", ['offplan_primary', 'offplan_secondary', 'ready_primary', 'ready_secondary'])
export const propertyStatus = pgEnum("property_status", ['draft', 'published', 'unpublished', 'deleted'])


export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const propertyAmenities = pgTable("property_amenities", {
	id: text().primaryKey().notNull(),
	propertyId: text("property_id").notNull(),
	amenityId: text("amenity_id").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	icon: text(),
});

export const propertyImages = pgTable("property_images", {
	id: text().primaryKey().notNull(),
	propertyId: text("property_id"),
	crmUrl: text("crm_url"),
	order: integer().default(0),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	s3Url: text("s3_url"),
});

export const properties = pgTable("properties", {
	id: text().primaryKey().notNull(),
	title: text(),
	name: text(),
	description: text(),
	bedrooms: integer(),
	bathrooms: integer(),
	buildYear: text("build_year"),
	agentId: text("agent_id"),
	slug: text().notNull(),
	completionStatus: text("completion_status"),
	developerId: text("developer_id"),
	communityId: text("community_id"),
	cityId: text("city_id"),
	offeringTypeId: text("offering_type_id"),
	unitTypeId: text("unit_type_id"),
	typeId: text("type_id"),
	longitude: text(),
	latitude: text(),
	cheques: text(),
	imported: boolean().default(false),
	floor: text(),
	permitNumber: text("permit_number"),
	plotSize: integer("plot_size"),
	availabilityDate: timestamp("availability_date", { mode: 'string' }),
	parking: text(),
	furnished: text(),
	referenceNumber: text("reference_number"),
	subCommunity: text("sub_community"),
	serviceCharge: text("service_charge"),
	size: integer(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	availability: propertyAvailability().default('unavailable'),
	status: propertyStatus().default('draft'),
	offplanCompletionStatus: propertyCompletionStatus("offplan_completion_status"),
	lastUpdated: timestamp("last_updated", { withTimezone: true, mode: 'string' }),
	isFeatured: boolean("is_featured").default(false),
	isExclusive: boolean("is_exclusive").default(false),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	price: bigint({ mode: "number" }),
	isLuxe: boolean("is_luxe").default(false),
}, (table) => [
	uniqueIndex("properties_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_fkey"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	uniqueIndex("sessions_token_unique").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_fkey"
		}).onDelete("cascade"),
]);

export const twoFactors = pgTable("two_factors", {
	id: text().primaryKey().notNull(),
	secret: text().notNull(),
	backupCodes: text("backup_codes").notNull(),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "two_factors_user_id_fkey"
		}).onDelete("cascade"),
]);

export const communities = pgTable("communities", {
	id: text().primaryKey().notNull(),
	name: text(),
	longitude: text(),
	latitude: text(),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	image: text(),
	about: text(),
	label: text(),
	cityId: text("city_id"),
	isPublic: boolean("is_public").default(true),
	metaDesc: text("meta_desc"),
	metaTitle: text("meta_title"),
	metaKeywords: text("meta_keywords"),
	featured: boolean().default(false),
	displayOrder: integer("display_order").default(0),
	isLuxe: boolean("is_luxe").default(false),
	luxeMetaTitle: text("luxe_meta_title"),
	luxeImageUrl: text("luxe_image_url"),
	luxeHeroImageUrl: text("luxe_hero_image_url"),
	luxeName: text("luxe_name"),
	luxeMetaDesc: text("luxe_meta_desc"),
	luxeAbout: text("luxe_about"),
	luxeFeatured: boolean("luxe_featured").default(false),
	luxeDisplayOrder: integer("luxe_display_order").default(0),
}, (table) => [
	uniqueIndex("communities_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const activities = pgTable("activities", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	modelId: text("model_id"),
	modelType: text("model_type"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const agentLanguages = pgTable("agent_languages", {
	id: text().primaryKey().notNull(),
	agentId: text().notNull(),
	languageId: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const luxeCommunities = pgTable("luxe_communities", {
	id: text().primaryKey().notNull(),
	communityId: text("community_id").notNull(),
	name: text().notNull(),
	metaTitle: text("meta_title"),
	metaDesc: text("meta_desc"),
	about: text(),
	image: text(),
	heroImage: text("hero_image"),
	featured: boolean().default(false),
	displayOrder: integer("display_order").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.communityId],
			foreignColumns: [communities.id],
			name: "luxe_communities_community_id_fkey"
		}),
]);

export const employees = pgTable("employees", {
	id: text().primaryKey().notNull(),
	firstName: text("first_name"),
	slug: text().notNull(),
	lastName: text("last_name"),
	avatarUrl: text("avatar_url"),
	rera: text(),
	phone: text(),
	email: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	bio: text(),
	isActive: text("is_active").default('false'),
	order: integer().default(100),
	title: text(),
	type: text().default('agent'),
	userId: text("user_id"),
	teamId: text("team_id"),
	isVisible: boolean("is_visible").default(false),
	isLuxe: boolean("is_luxe").default(false),
}, (table) => [
	uniqueIndex("employees_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const amenities = pgTable("amenities", {
	id: text().primaryKey().notNull(),
	name: text(),
	slug: text(),
	icon: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const assignedOwners = pgTable("assigned_owners", {
	id: text().primaryKey().notNull(),
	agentId: text("agent_id"),
	propertyOwnerId: text("property_owner_id"),
	name: text(),
	address: text(),
	mobile: text(),
	residentCountry: text("resident_country"),
	secondaryMobile: text("secondary_mobile"),
	national: text(),
	createdBy: text("created_by"),
	updatedBy: text("updated_by"),
	assignedTo: text("assigned_to"),
	secondaryPhone: text("secondary_phone"),
	areaOwned: text("area_owned"),
	plotNumber: text("plot_number"),
	totalArea: text("total_area"),
	usageType: text("usage_type"),
	project: text(),
	masterProject: text("master_project"),
	municipalityNumber: text("municipality_number"),
	commonArea: text("common_area"),
	parkingArea: text("parking_area"),
	balconyArea: text("balcony_area"),
	flatNumber: text("flat_number"),
	registrationNumber: text("registration_number"),
	buildingName: text("building_name"),
	area: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	floors: text(),
});

export const authors = pgTable("authors", {
	id: text().primaryKey().notNull(),
	name: text(),
	about: text(),
	avatar: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const buildings = pgTable("buildings", {
	id: text().primaryKey().notNull(),
	propertyId: text("property_id"),
	name: text(),
	type: text(),
	about: text(),
	bedrooms: integer(),
	longitudes: real(),
	latitudes: real(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const cities = pgTable("cities", {
	id: text().primaryKey().notNull(),
	name: text(),
	longitude: text(),
	latitude: text(),
	countryId: text("country_id"),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("cities_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const comments = pgTable("comments", {
	id: text().primaryKey().notNull(),
	content: text().notNull(),
	commentableId: text("commentable_id"),
	commentableType: text("commentable_type"),
	userId: text("user_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
	id: text().primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text(),
	phone: text(),
	address: text(),
	mobile: text(),
	imported: boolean().default(false),
	createdBy: text("created_by"),
	updatedBy: text("updated_by"),
	assignedTo: text("assigned_to"),
	secondaryPhone: text("secondary_phone"),
	residence: text(),
	national: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const countries = pgTable("countries", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	longitude: text(),
	latitude: text(),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("countries_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const departments = pgTable("departments", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	shortName: text("short_name"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const developers = pgTable("developers", {
	id: text().primaryKey().notNull(),
	name: text(),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	logoUrl: text("logo_url"),
	website: text(),
	about: text(),
	featuredImage: text("featured_image"),
	order: integer().default(100),
}, (table) => [
	uniqueIndex("developers_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const developments = pgTable("developments", {
	id: text().primaryKey().notNull(),
	title: text(),
	description: text(),
	bedrooms: text(),
	bathrooms: text(),
	buildYear: text("build_year"),
	slug: text().notNull(),
	price: text(),
	completionStatus: text("completion_status"),
	developerId: text("developer_id"),
	communityId: text("community_id"),
	cityId: text("city_id"),
	offeringTypeId: text("offering_type_id"),
	propertyTypeId: text("property_type_id"),
	longitude: text(),
	latitude: text(),
	cheques: text(),
	floor: text(),
	availabilityDate: timestamp("availability_date", { mode: 'string' }),
	parking: text(),
	furnished: text(),
	referenceNumber: text("reference_number"),
	subCommunity: text("sub_community"),
	serviceCharge: text("service_charge"),
	size: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("developments_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const facilities = pgTable("facilities", {
	id: text().primaryKey().notNull(),
	name: text(),
	description: text(),
	icon: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
	id: text().primaryKey().notNull(),
	question: text(),
	answer: text(),
	targetId: text("target_id"),
	targetModel: text("target_model"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	imageUrl: text("image_url"),
});

export const floorPlans = pgTable("floor_plans", {
	id: text().primaryKey().notNull(),
	name: text(),
	propertyId: text("property_id"),
	fileType: text("file_type").default('image'),
	url: text(),
	order: integer().default(0),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	type: text(),
	bedrooms: integer(),
});

export const importJobs = pgTable("import_jobs", {
	id: text().primaryKey().notNull(),
	status: importJobTypes().default('pending'),
	propertyCount: integer("property_count"),
	importedCount: integer("imported_count"),
	updatedCount: integer("updated_count"),
	failedCount: integer("failed_count"),
	failedProperties: jsonb("failed_properties"),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const languages = pgTable("languages", {
	id: text().primaryKey().notNull(),
	name: text(),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	icon: text(),
});

export const leads = pgTable("leads", {
	id: text().primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text(),
	phone: text().notNull(),
	message: text(),
	source: text(),
	propertyId: text("property_id"),
	agentId: text("agent_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("leads_phone_unique").using("btree", table.phone.asc().nullsLast().op("text_ops")),
]);

export const media = pgTable("media", {
	id: text().primaryKey().notNull(),
	modelId: text("model_id").notNull(),
	modelType: text("model_type").notNull(),
	name: text().notNull(),
	fileName: text("file_name").notNull(),
	disk: text(),
	collectionName: text("collection_name").notNull(),
	mimeType: text("mime_type").notNull(),
	size: text().notNull(),
	manipulations: jsonb(),
	customProperties: jsonb("custom_properties"),
	responsiveImages: jsonb("responsive_images"),
	orderColumn: text("order_column"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	url: text().notNull(),
});

export const notes = pgTable("notes", {
	id: text().primaryKey().notNull(),
	title: text(),
	content: text(),
	userId: text("user_id"),
	notetableId: text("notetable_id"),
	notetableType: text("notetable_type"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const offerTypes = pgTable("offer_types", {
	id: text().primaryKey().notNull(),
	name: text(),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("offer_types_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const offeringTypes = pgTable("offering_types", {
	id: text().primaryKey().notNull(),
	name: text(),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metaTitle: text("meta_title"),
	metaDescription: text("meta_description"),
	about: text(),
	pageTitle: text("page_title"),
}, (table) => [
	uniqueIndex("offering_types_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const offplanFacilities = pgTable("offplan_facilities", {
	id: text().primaryKey().notNull(),
	offplanId: text("offplan_id"),
	facilityId: text("facility_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const offplanImages = pgTable("offplan_images", {
	id: text().primaryKey().notNull(),
	offplanId: text("offplan_id"),
	url: text(),
	order: integer().default(0),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const offplans = pgTable("offplans", {
	id: text().primaryKey().notNull(),
	paymentTitle: text("payment_title"),
	name: text(),
	about: text(),
	buildYear: text("build_year"),
	floors: integer(),
	brochureUrl: text("brochure_url"),
	slug: text().notNull(),
	completionStatus: text("completion_status"),
	developerId: text("developer_id"),
	communityId: text("community_id"),
	buildingId: text("building_id"),
	longitude: real(),
	latitude: real(),
	permitNumber: text("permit_number"),
	availabilityDate: timestamp("availability_date", { mode: 'string' }),
	subCommunity: text("sub_community"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	handoverDate: timestamp("handover_date", { mode: 'string' }),
	fromSize: integer("from_size"),
	toSize: integer("to_size"),
	fromPrice: integer("from_price"),
	toPrice: integer("to_price"),
	qrCode: text("qr_code"),
}, (table) => [
	uniqueIndex("offplans_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const paymentPlans = pgTable("payment_plans", {
	id: text().primaryKey().notNull(),
	offplanId: text("offplan_id"),
	title: text(),
	percentage: integer(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const emailVerifications = pgTable("email_verifications", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	userId: text("user_id").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("email_verifications_email_unique").using("btree", table.email.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "email_verifications_user_id_fkey"
		}),
]);

export const portalProperties = pgTable("portal_properties", {
	id: text().primaryKey().notNull(),
	propertyId: text("property_id"),
	portalId: text("portal_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const portals = pgTable("portals", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	url: text(),
	description: text(),
	frequency: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const propertyOwners = pgTable("property_owners", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	buildingName: text("building_name"),
	phone: text(),
	address: text(),
	mobile: text(),
	residentCountry: text("resident_country"),
	secondaryMobile: text("secondary_mobile"),
	nationality: text(),
	addedBy: text(),
	updatedBy: text("updated_by"),
	secondaryPhone: text("secondary_phone"),
	areaOwned: text("area_owned"),
	plotNumber: text("plot_number"),
	totalArea: text("total_area"),
	usageType: text("usage_type"),
	project: text(),
	masterProject: text("master_project"),
	municipalityNumber: text("municipality_number"),
	commonArea: text("common_area"),
	parkingArea: text("parking_area"),
	balconyArea: text("balcony_area"),
	unitNumber: text("unit_number"),
	registrationNumber: text("registration_number"),
	procedureNumber: text("procedure_number"),
	size: text(),
	roomType: text("room_type"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const propertyTypes = pgTable("property_types", {
	id: text().primaryKey().notNull(),
	name: text(),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	rentMetaTitle: text("rent_meta_title"),
	rentMetaDescription: text("rent_meta_description"),
	saleMetaTitle: text("sale_meta_title"),
	saleMetaDescription: text("sale_meta_description"),
	saleContent: jsonb("sale_content"),
	rentContent: jsonb("rent_content"),
	rentH1: text("rent_h1"),
	saleH1: text("sale_h1"),
}, (table) => [
	uniqueIndex("property_types_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const redirects = pgTable("redirects", {
	id: text().primaryKey().notNull(),
	fromUrl: text("from_url").notNull(),
	toUrl: text("to_url"),
	statusCode: text("status_code").notNull(),
	isActive: text("is_active").default('yes'),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("redirects_from_url_unique").using("btree", table.fromUrl.asc().nullsLast().op("text_ops")),
]);

export const subCommunities = pgTable("sub_communities", {
	id: text().primaryKey().notNull(),
	name: text(),
	label: text(),
	communityId: text("community_id"),
	longitude: text(),
	latitude: text(),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("sub_communities_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const unitTypes = pgTable("unit_types", {
	id: text().primaryKey().notNull(),
	name: text(),
	shortName: text("short_name"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("unit_types_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const pageMetas = pgTable("page_metas", {
	id: text().primaryKey().notNull(),
	metaTitle: text("meta_title"),
	metaDescription: text("meta_description"),
	title: text(),
	content: text(),
	path: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	noIndex: boolean("no_index"),
	noFollow: boolean("no_follow"),
	includeInSitemap: boolean("include_in_sitemap"),
	metaKeywords: text("meta_keywords"),
}, (table) => [
	uniqueIndex("page_metas_path_unique").using("btree", table.path.asc().nullsLast().op("text_ops")),
]);

export const insights = pgTable("insights", {
	id: text().primaryKey().notNull(),
	title: text(),
	communityId: text("community_id"),
	subCommunityId: text("sub_community_id"),
	cityId: text("city_id"),
	developerId: text("developer_id"),
	content: text(),
	developmentId: text("development_id"),
	isPublished: text("is_published"),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	agentId: text("agent_id"),
	slug: text().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	coverUrl: text("cover_url"),
	altText: text("alt_text"),
	metaDescription: text("meta_description"),
	metaTitle: text("meta_title"),
	author: text(),
	aboutAuthor: text("about_author"),
	isLuxe: boolean("is_luxe").default(false),
}, (table) => [
	uniqueIndex("insights_slug_unique").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	username: text(),
	email: text().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	name: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	displayUsername: text("display_username"),
	phoneNumber: text("phone_number"),
	phoneNumberVerified: boolean("phone_number_verified"),
	twoFactorEnabled: boolean("two_factor_enabled"),
	timezone: text(),
}, (table) => [
	uniqueIndex("users_email_unique").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("users_phone_number_unique").using("btree", table.phoneNumber.asc().nullsLast().op("text_ops")),
	uniqueIndex("users_username_unique").using("btree", table.username.asc().nullsLast().op("text_ops")),
]);

export const teams = pgTable("teams", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	leaderId: text("leader_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.leaderId],
			foreignColumns: [employees.id],
			name: "teams_leader_id_fkey"
		}),
]);
