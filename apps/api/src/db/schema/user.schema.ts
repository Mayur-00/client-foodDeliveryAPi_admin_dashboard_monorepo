import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  real,
  uniqueIndex,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
export const userStatusEnum = pgEnum("user-status-enum", [
  "CREATED",
  "VERIFIED",
  "BLOCKED",
]);


export const userTable = pgTable(
  "userTable",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    phone: text("phone").notNull().unique(),
    status:userStatusEnum().notNull().default('CREATED'),
    image: text("image"),
    address: text("address"),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("user_phone_unique_idx").on(table.phone)],
);

