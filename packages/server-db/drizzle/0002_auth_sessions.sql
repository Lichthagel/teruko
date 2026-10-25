CREATE TABLE "AuthSession" (
  "id" text PRIMARY KEY NOT NULL,
  "subject" text NOT NULL,
  "email" text,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession" USING btree ("expiresAt");
CREATE TABLE "UserToken" (
  "id" text PRIMARY KEY NOT NULL,
  "subject" text NOT NULL,
  "tokenHash" text NOT NULL UNIQUE,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "revokedAt" timestamp
);
CREATE INDEX "UserToken_subject_idx" ON "UserToken" USING btree ("subject");
