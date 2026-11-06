import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
} from "drizzle-orm/pg-core";

export const adminTable = pgTable("adminTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone:text("phone").notNull(),
  password:text('password').notNull(),  
  isVerified:boolean("is-verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

