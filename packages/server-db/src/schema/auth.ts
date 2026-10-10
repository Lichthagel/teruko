import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const dAuthSession = pgTable("AuthSession", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  email: text("email"),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
}, table => [index("AuthSession_expiresAt_idx").on(table.expiresAt)]);

export const dUserToken = pgTable("UserToken", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  tokenHash: text("tokenHash").notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  revokedAt: timestamp("revokedAt", { mode: "date" }),
}, table => [index("UserToken_subject_idx").on(table.subject)]);
