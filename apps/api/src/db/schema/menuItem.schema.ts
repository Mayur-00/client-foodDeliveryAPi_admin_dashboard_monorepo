import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  integer,
  pgEnum,
  real,
} from "drizzle-orm/pg-core"
import { restorantTable } from "./restorant.schema.js";

export const dietCategoryEnum = pgEnum('diet_category', ['veg', 'non-veg']);
export const menuItemTable = pgTable("menuItemTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  category:dietCategoryEnum('diet-category').default('veg').notNull(),
  images: text("images").array().notNull(),
  isAvailable:boolean("is-available").default(true).notNull(),
  quantity:integer('quantity').default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  restorantId: uuid("restorantId").notNull().references(()=>restorantTable.id,{onDelete:"cascade"}),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
},
  (table) => [index("menuItem_restorantId_idx").on(table.restorantId)],);
