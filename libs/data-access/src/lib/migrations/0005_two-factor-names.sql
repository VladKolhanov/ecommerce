ALTER TABLE "users" RENAME COLUMN "mfa_enabled" TO "is_two_factor_enabled";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "mfa_secret_key" TO "two_factor_secret_key";