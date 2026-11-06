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
  real,
} from "drizzle-orm/pg-core";
export const restorantDietCategoryEnum = pgEnum("restorant_diet_category", [
  "veg",
  "non-veg",
  "veg/non-veg",
]);
export const restorantStatusEnum = pgEnum("restorant_status", [
  "CREATED",
  "VERIFIED",
  "SUBMITED",
  "APPROVED"
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
  phone: text("phone").notNull().unique(),
  dietCategory: restorantDietCategoryEnum("diet-category").default("veg/non-veg").notNull(),
  category:restorantCategoryEnum('category').default('fast-food').notNull(),
  status:restorantStatusEnum().notNull().default("CREATED"),
  image: text("images").notNull(),
  cashOwed:real('cash-owed').notNull().default(0),
  isOpen:boolean("is-open").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [uniqueIndex("restorant_phone_unique_idx").on(table.phone)]);

