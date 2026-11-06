import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { menuItemTable } from "./menuItem.schema.js";
import { orderTable } from "./order.schema.js";
export const addressTable = pgTable(
  "addressTable",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    houseNo: text("house-no"),
    street: text("street"),
    area: text("area"),
    landmark: text("landmark"),
    city: text("city").notNull(),
    district: text("distric").notNull(),
    postcode: text("postcode").notNull(),
    ownerId: uuid("order-id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("address-ownerId-idx").on(table.ownerId)],
);
