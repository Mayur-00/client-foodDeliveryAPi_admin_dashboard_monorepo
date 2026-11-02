import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  integer,
  real
} from "drizzle-orm/pg-core"
import { menuItemTable } from "./menuItem.schema.js";
import { orderTable } from "./order.schema.js";
export const orderItemTable = pgTable("orderItemTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name:text('item-name').notNull(),
  quantity:integer('item-quantity').notNull(),
  price:real('item-price').notNull(),
  totalPrice:real("total-price").notNull(),
  menuItemId:uuid("menuItem-id").notNull().references(()=> menuItemTable.id, {onDelete:"cascade"}),
  orderId:uuid('order-id').notNull().references(()=>orderTable.id, {onDelete:"cascade"}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
},
(table)=>[index('orderItem-orderId-idx').on(table.orderId)]);