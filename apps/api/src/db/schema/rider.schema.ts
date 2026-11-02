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
} from "drizzle-orm/pg-core"

export const riderTable = pgTable("riderTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone:text("phone").notNull(),
  isVerified:boolean('is-verified').default(false).notNull(),
  image: text("image"),
  lastLocation:text("last-location"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  isAvailable:boolean("is-available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [uniqueIndex("rider_phone_unique_idx").on(table.phone)]);

export const riderSessionTable = pgTable(
  "riderSessionTable",
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
    riderId: uuid("rider_id")
      .notNull()
      .references(() => riderTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("riderSession_riderId_idx").on(table.riderId)],
);
