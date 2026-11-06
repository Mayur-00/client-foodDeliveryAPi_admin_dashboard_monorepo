import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  integer,
  real,
  decimal,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { userTable } from "./user.schema.js";
import { restorantTable } from "./restorant.schema.js";
import { riderTable } from "./rider.schema.js";
import { orderTable } from "./order.schema.js";
export const deliveryStatusEnum = pgEnum('delivery-status-enum', [ 'STARTED', 'COMPLETED', 'CANCELLED']);

export const deliveryAssignmentTable = pgTable("deliveryAssignmentTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  riderId:uuid('rider_id').notNull().references(()=>riderTable.id, {onDelete:'cascade'}),
  orderId:uuid('order_id').notNull().references(()=>orderTable.id, {onDelete:"cascade"}),
  status:deliveryStatusEnum().default("STARTED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [uniqueIndex("delivery_assignment_order_unique_idx").on(table.orderId)]);
