import {
  pgTable,
  text,
  timestamp,

  uuid,
  integer,
  pgEnum,
  decimal,
  uniqueIndex,
  real,
  index,
} from "drizzle-orm/pg-core";
import { restorantTable } from "./restorant.schema.js";
import { adminTable } from "./admin.schema.js";
export const restorantDietCategoryEnum = pgEnum("restorant_diet_category", [
  "veg",
  "non-veg",
  "veg/non-veg",
]);
export const settlementStatusEnum = pgEnum("settlement_status", [
  "SUBMITED",
  "APPROVED"
]);
export const settlementTable = pgTable("settlementTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  cashSettled:real("cash-settled").notNull().default(0),
  status:settlementStatusEnum().notNull().default("SUBMITED"),
  adminId:uuid('admin_id').references(()=>adminTable.id, {onDelete:"cascade"}),
  restorantId:uuid('restorant_id').references(()=>restorantTable.id, {onDelete:"cascade"}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [index("settlement_restorant_unique_idx").on(table.restorantId)]);

