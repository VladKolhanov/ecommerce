ALTER TABLE "users" ADD COLUMN "mfa_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mfa_secret_key" varchar;