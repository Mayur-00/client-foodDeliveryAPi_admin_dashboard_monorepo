CREATE TYPE "public"."user-status-enum" AS ENUM('CREATED', 'VERIFIED', 'BLOCKED');--> statement-breakpoint
CREATE TYPE "public"."restorant_category" AS ENUM('dhaba', 'south-indian', 'north-indian', 'chinese', 'fast-food', 'maharashtrian');--> statement-breakpoint
CREATE TYPE "public"."restorant_diet_category" AS ENUM('veg', 'non-veg', 'veg/non-veg');--> statement-breakpoint
CREATE TYPE "public"."diet_category" AS ENUM('veg', 'non-veg');--> statement-breakpoint
CREATE TYPE "public"."failure-reason-enum" AS ENUM('Order declined by Customer', 'Failed By Restorant', 'Customer Didn''t shown up', 'Rider couldn''t deliver');--> statement-breakpoint
CREATE TYPE "public"."order-status-enum" AS ENUM('PENDING_VENDOR', 'ACCEPTED', 'DECLINED', 'PREPARING', 'READY', 'ASSIGNED', 'PICKED_UP', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."delivery-status-enum" AS ENUM('rider assigned', 'order picked up by rider', 'order deliverd');--> statement-breakpoint
CREATE TABLE "adminSessionTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "adminSessionTable_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "adminTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"is-verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"status" "user-status-enum" DEFAULT 'CREATED' NOT NULL,
	"image" text,
	"address" text,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userTable_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "restorantSessionTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"restorant_id" uuid NOT NULL,
	CONSTRAINT "restorantSessionTable_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "restorantTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"diet-category" "restorant_diet_category" DEFAULT 'veg/non-veg' NOT NULL,
	"category" "restorant_category" DEFAULT 'fast-food' NOT NULL,
	"images" text[] NOT NULL,
	"is-available" boolean DEFAULT true NOT NULL,
	"is-open" boolean DEFAULT false NOT NULL,
	"is-approved" boolean DEFAULT false NOT NULL,
	"is-verified" boolean DEFAULT false NOT NULL,
	"latitude" numeric(8, 6) NOT NULL,
	"longitude" numeric(9, 6) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "riderSessionTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"rider_id" uuid NOT NULL,
	CONSTRAINT "riderSessionTable_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "riderTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"is-verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"last-location" text,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"is-available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menuItemTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"diet-category" "diet_category" DEFAULT 'veg' NOT NULL,
	"images" text[] NOT NULL,
	"is-available" boolean DEFAULT true NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"restorantId" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer-id" uuid NOT NULL,
	"delivery-latitude" numeric(8, 6) NOT NULL,
	"delivery-longitude" numeric(9, 6) NOT NULL,
	"restorant-id" uuid NOT NULL,
	"customer-name" text NOT NULL,
	"customer-phone" text NOT NULL,
	"delivery-address" text NOT NULL,
	"subtotal" real NOT NULL,
	"delivery-fee" real NOT NULL,
	"commission" real NOT NULL,
	"total" real NOT NULL,
	"payment-method" text DEFAULT 'CASH_ON_DELIVERY' NOT NULL,
	"status" "order-status-enum" DEFAULT 'PENDING_VENDOR' NOT NULL,
	"failureReason" "failure-reason-enum",
	"decline-reason" text,
	"delivery-otp" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderItemTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item-name" text NOT NULL,
	"item-quantity" integer NOT NULL,
	"item-price" real NOT NULL,
	"total-price" real NOT NULL,
	"menuItem-id" uuid NOT NULL,
	"order-id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliveryAssignmentTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rider_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"status" "delivery-status-enum" DEFAULT 'rider assigned' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adminSessionTable" ADD CONSTRAINT "adminSessionTable_user_id_adminTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."adminTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restorantSessionTable" ADD CONSTRAINT "restorantSessionTable_restorant_id_restorantTable_id_fk" FOREIGN KEY ("restorant_id") REFERENCES "public"."restorantTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riderSessionTable" ADD CONSTRAINT "riderSessionTable_rider_id_riderTable_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riderTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menuItemTable" ADD CONSTRAINT "menuItemTable_restorantId_restorantTable_id_fk" FOREIGN KEY ("restorantId") REFERENCES "public"."restorantTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderTable" ADD CONSTRAINT "orderTable_customer-id_userTable_id_fk" FOREIGN KEY ("customer-id") REFERENCES "public"."userTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderTable" ADD CONSTRAINT "orderTable_restorant-id_restorantTable_id_fk" FOREIGN KEY ("restorant-id") REFERENCES "public"."restorantTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItemTable" ADD CONSTRAINT "orderItemTable_menuItem-id_menuItemTable_id_fk" FOREIGN KEY ("menuItem-id") REFERENCES "public"."menuItemTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItemTable" ADD CONSTRAINT "orderItemTable_order-id_orderTable_id_fk" FOREIGN KEY ("order-id") REFERENCES "public"."orderTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveryAssignmentTable" ADD CONSTRAINT "deliveryAssignmentTable_rider_id_riderTable_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riderTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveryAssignmentTable" ADD CONSTRAINT "deliveryAssignmentTable_order_id_orderTable_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orderTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "adminSession_adminId_idx" ON "adminSessionTable" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_phone_unique_idx" ON "userTable" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "session_restorantId_idx" ON "restorantSessionTable" USING btree ("restorant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "restorant_phone_unique_idx" ON "restorantTable" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "riderSession_riderId_idx" ON "riderSessionTable" USING btree ("rider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rider_phone_unique_idx" ON "riderTable" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "menuItem_restorantId_idx" ON "menuItemTable" USING btree ("restorantId");--> statement-breakpoint
CREATE INDEX "orderItem-orderId-idx" ON "orderItemTable" USING btree ("order-id");--> statement-breakpoint
CREATE UNIQUE INDEX "delivery_assignment_order_unique_idx" ON "deliveryAssignmentTable" USING btree ("order_id");