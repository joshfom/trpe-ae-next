import { relations } from "drizzle-orm/relations";
import { users, accounts, sessions, twoFactors, communities, luxeCommunities, emailVerifications, employees, teams } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	twoFactors: many(twoFactors),
	emailVerifications: many(emailVerifications),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const twoFactorsRelations = relations(twoFactors, ({one}) => ({
	user: one(users, {
		fields: [twoFactors.userId],
		references: [users.id]
	}),
}));

export const luxeCommunitiesRelations = relations(luxeCommunities, ({one}) => ({
	community: one(communities, {
		fields: [luxeCommunities.communityId],
		references: [communities.id]
	}),
}));

export const communitiesRelations = relations(communities, ({many}) => ({
	luxeCommunities: many(luxeCommunities),
}));

export const emailVerificationsRelations = relations(emailVerifications, ({one}) => ({
	user: one(users, {
		fields: [emailVerifications.userId],
		references: [users.id]
	}),
}));

export const teamsRelations = relations(teams, ({one}) => ({
	employee: one(employees, {
		fields: [teams.leaderId],
		references: [employees.id]
	}),
}));

export const employeesRelations = relations(employees, ({many}) => ({
	teams: many(teams),
}));