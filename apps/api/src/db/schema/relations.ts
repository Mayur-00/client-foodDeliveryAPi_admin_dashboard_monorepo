import { relations } from "drizzle-orm";
import { userTable } from "./user.schema.js";
import { orderTable } from "./order.schema.js";
import { adminTable } from "./admin.schema.js";
import {  restorantTable } from "./restorant.schema.js";
import { menuItemTable } from "./menuItem.schema.js";
import { riderTable } from "./rider.schema.js";
import { deliveryAssignmentTable } from "./deliveryAssignment.schema.js";
import { orderItemTable } from "./orderItem.schema.js";
import { addressTable } from "./address.schema.js";

export const userRelations = relations(userTable, ({ many }) => ({
  orders: many(orderTable),
  addresses:many(addressTable)
}));
// export const userSessionRelations = relations(userSessionTable, ({ one }) => ({
//   userTable: one(userTable, {
//     fields: [userSessionTable.userId],
//     references: [userTable.id],
//   }),
// }));

export const restorantRelations = relations(restorantTable, ({ many }) => ({
    menuItems: many(menuItemTable),
    adresses:many(addressTable),
  orders: many(orderTable),
}));

export const riderRelations = relations(riderTable, ({ many }) => ({
  deliveryAssignments: many(deliveryAssignmentTable),
}));

export const orderRelations = relations(orderTable, ({ many, one }) => ({
  orderItems: many(orderItemTable),
  user: one(userTable, {
    fields: [orderTable.customerId],
    references: [userTable.id],
  }),
  restorant: one(restorantTable, {
    fields: [orderTable.restorantId],
    references: [restorantTable.id],
  }),
  deliverAssignment: one(deliveryAssignmentTable),
}));

export const deliveryAssignmentRelations = relations(deliveryAssignmentTable, ({one})=>({
    rider:one( riderTable, {
        fields:[deliveryAssignmentTable.riderId],
        references:[riderTable.id]
    }),
    order:one( orderTable, {
        fields:[deliveryAssignmentTable.orderId],
        references:[orderTable.id]
    }),
}))
export const menuItemRelations = relations(menuItemTable, ({many, one})=>({
    orderItems:many(orderItemTable),
    restorant:one( restorantTable, {
        fields:[menuItemTable.restorantId],
        references:[restorantTable.id]
    }),
}));

export const orderItemRelations = relations(orderItemTable, ({many, one})=>({
   
    menuItem:one( menuItemTable, {
        fields:[orderItemTable.menuItemId],
        references:[menuItemTable.id]
    }),
    order:one( orderTable, {
        fields:[orderItemTable.orderId],
        references:[orderTable.id]
    }),
}))
