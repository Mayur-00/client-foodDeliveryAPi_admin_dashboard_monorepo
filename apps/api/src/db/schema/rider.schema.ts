import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  integer,
  real,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const riderStatusEnum = pgEnum("rider-status-enum", [
  "DELIVERING",
  "ONLINE",
  "OFFLINE",
  "BLOCKED",
]);

export const riderTable = pgTable("riderTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone:text("phone").notNull(),
  cashOnHold:real('cash-on-hold').default(0),
  status:riderStatusEnum().default('OFFLINE'),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [uniqueIndex("rider_phone_unique_idx").on(table.phone)]);
