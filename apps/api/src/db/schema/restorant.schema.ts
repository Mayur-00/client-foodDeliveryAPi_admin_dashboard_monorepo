import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  integer,
  pgEnum,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";
export const restorantDietCategoryEnum = pgEnum("restorant_diet_category", [
  "veg",
  "non-veg",
  "veg/non-veg",
]);
export const restorantCategoryEnum = pgEnum("restorant_category", [
  "dhaba",
  "south-indian",
  "north-indian",
  "chinese",
  "fast-food",
  "maharashtrian"
]);
export const restorantTable = pgTable("restorantTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  dietCategory: restorantDietCategoryEnum("diet-category").default("veg/non-veg").notNull(),
  category:restorantCategoryEnum('category').default('fast-food').notNull(),
  images: text("images").array().notNull(),
  isAvailable: boolean("is-available").default(true).notNull(),
  isOpen:boolean("is-open").default(false).notNull(),
  isApproved:boolean("is-approved").default(false).notNull(),
  isVerified: boolean("is-verified").default(false).notNull(),
  latitude: decimal("latitude", { precision: 8, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 9, scale: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [uniqueIndex("restorant_phone_unique_idx").on(table.phone)]);

export const restorantSessionTable = pgTable(
  "restorantSessionTable",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    restorantId: uuid("restorant_id")
      .notNull()
      .references(() => restorantTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_restorantId_idx").on(table.restorantId)],
);
