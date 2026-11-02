import {
  pgTable,
  text,
  timestamp,
  uuid,
  real,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { userTable } from "./user.schema.js";
import { restorantTable } from "./restorant.schema.js";

export const orderStatusEnum = pgEnum("order-status-enum", [
  "PENDING_VENDOR",
  "ACCEPTED",
  "DECLINED",
  "PREPARING",
  "READY",
  "ASSIGNED",
  "PICKED_UP",
  "DELIVERED",
  "CANCELLED",
]);
export const FailureReasonEnum = pgEnum('failure-reason-enum', ['Order declined by Customer', 'Failed By Restorant', "Customer Didn't shown up", "Rider couldn't deliver"]);

export const orderTable = pgTable("orderTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId:uuid('customer-id').notNull().references(()=>userTable.id, {onDelete:'cascade'}),
  deliveryLatitude:decimal('delivery-latitude', { precision: 8, scale: 6 }).notNull(),
  deliveryLongitude:decimal('delivery-longitude', { precision: 9, scale: 6 }).notNull(),
  restorantId:uuid('restorant-id').notNull().references(()=> restorantTable.id, {onDelete:'cascade'}),
  customerName: text("customer-name").notNull(),
  customerPhone: text("customer-phone").notNull(),
  deliveryAddress: text("delivery-address").notNull(),
  subtotal: real("subtotal").notNull(),
  deliveryFee: real("delivery-fee").notNull(),
  commission: real("commission").notNull(),
  total: real("total").notNull(),
  paymentMethod: text("payment-method").notNull().default("CASH_ON_DELIVERY"),
  status: orderStatusEnum().default("PENDING_VENDOR").notNull(),
  failureReason:FailureReasonEnum(),
  declineReason: text("decline-reason"),
  deliveryOtp:text('delivery-otp').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
