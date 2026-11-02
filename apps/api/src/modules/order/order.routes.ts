// import { randomInt } from "node:crypto";
// import { Router } from "express";
// import { and, desc, eq, inArray } from "drizzle-orm";
// import { z } from "zod";
// import { db } from "../../db/index.js";
// import {
//   deliveryAssignmentTable,
//   menuItemTable,
//   orderItemTable,
//   orderTable,
//   restorantTable,
//   riderTable,
//   userTable,
// } from "../../db/schema/index.js";
// import { authorize } from "../../middleware/auth.middleware.js";
// import { ApiError } from "../../utils/apiError.js";
// import { asyncHandler } from "../../utils/asyncHandler.js";
// import { accountRoom, getRealtimeServer } from "../../utils/realtime.js";

// const placeOrderSchema = z
//   .object({
//     restaurantId: z.string().uuid(),
//     items: z
//       .array(
//         z.object({
//           menuItemId: z.string().uuid(),
//           quantity: z.number().int().min(1).max(50),
//         }),
//       )
//       .min(1)
//       .max(50),
//     deliveryLocation: z.object({
//       latitude: z.number().min(-90).max(90),
//       longitude: z.number().min(-180).max(180),
//     }),
//     deliveryAddress: z.string().trim().min(5).max(500),
//   })
//   .superRefine((data, context) => {
//     const ids = data.items.map((item) => item.menuItemId);
//     if (new Set(ids).size !== ids.length) {
//       context.addIssue({
//         code: "custom",
//         message: "Each menu item can appear only once",
//         path: ["items"],
//       });
//     }
//   });

// const declineSchema = z.object({
//   reason: z.string().trim().min(3).max(300),
// });

// export const orderRouter = Router();

// orderRouter.post(
//   "/orders",
//   authorize("USER"),
//   asyncHandler(async (req, res) => {
//     const payload = placeOrderSchema.parse(req.body);
//     const accountId = req.account?.id;
//     if (!accountId) {
//       throw new ApiError(401, "Authentication required", "AUTH_REQUIRED");
//     }
//     const [user] = await db
//       .select({
//         id: userTable.id,
//         name: userTable.name,
//         phone: userTable.phone,
//         isVerified: userTable.isVerified,
//         isBlocked: userTable.isBlocked,
//       })
//       .from(userTable)
//       .where(eq(userTable.id, accountId))
//       .limit(1);
//     if (!user || !user.isVerified || user.isBlocked) {
//       throw new ApiError(403, "User account is not allowed to order", "ACCOUNT_BLOCKED");
//     }

//     const [restaurant] = await db
//       .select()
//       .from(restorantTable)
//       .where(
//         and(
//           eq(restorantTable.id, payload.restaurantId),
//           eq(restorantTable.isAvailable, true),
//           eq(restorantTable.isOpen, true),
//           eq(restorantTable.isApproved, true),
//         ),
//       )
//       .limit(1);
//     if (!restaurant) {
//       throw new ApiError(409, "Restaurant is not accepting orders", "RESTAURANT_UNAVAILABLE");
//     }

//     const menuItems = await db
//       .select()
//       .from(menuItemTable)
//       .where(
//         and(
//           eq(menuItemTable.restorantId, payload.restaurantId),
//           eq(menuItemTable.isAvailable, true),
//           inArray(
//             menuItemTable.id,
//             payload.items.map((item) => item.menuItemId),
//           ),
//         ),
//       );
//     if (menuItems.length !== payload.items.length) {
//       throw new ApiError(
//         400,
//         "One or more selected items are unavailable",
//         "MENU_ITEM_UNAVAILABLE",
//       );
//     }

//     const menuById = new Map(menuItems.map((item) => [item.id, item]));
//     const itemSnapshots = payload.items.map((item) => {
//       const menuItem = menuById.get(item.menuItemId);
//       if (!menuItem) {
//         throw new ApiError(400, "Selected item is unavailable", "MENU_ITEM_UNAVAILABLE");
//       }
//       const lineTotal = Math.round(menuItem.price * item.quantity * 100) / 100;
//       return {
//         menuItemId: menuItem.id,
//         name: menuItem.name,
//         quantity: item.quantity,
//         price: menuItem.price,
//         totalPrice: lineTotal,
//       };
//     });

//     const subtotal =
//       Math.round(
//         itemSnapshots.reduce((sum, item) => sum + item.totalPrice, 0) * 100,
//       ) / 100;
//     const deliveryFee = subtotal < 300 ? 10 : 0;
//     const commission = Math.round(subtotal * 10) / 100;
//     const total = Math.round((subtotal + deliveryFee) * 100) / 100;
//     const deliveryOtp = randomInt(100000, 1000000).toString();

//     const createdOrder = await db.transaction(async (transaction) => {
//       const [order] = await transaction
//         .insert(orderTable)
//         .values({
//           customerId: user.id,
//           customerName: user.name,
//           customerPhone: user.phone,
//           restorantId: restaurant.id,
//           deliveryLatitude: payload.deliveryLocation.latitude.toFixed(6),
//           deliveryLongitude: payload.deliveryLocation.longitude.toFixed(6),
//           deliveryAddress: payload.deliveryAddress,
//           subtotal,
//           deliveryFee,
//           commission,
//           total,
//           deliveryOtp,
//         })
//         .returning();

//       await transaction.insert(orderItemTable).values(
//         itemSnapshots.map((item) => ({
//           ...item,
//           orderId: order.id,
//         })),
//       );
//       return order;
//     });

//     const { deliveryOtp: _deliveryOtp, ...visibleOrder } = createdOrder;
//     const eventData = { order: visibleOrder, items: itemSnapshots };
//     const io = getRealtimeServer(req);
//     io.to(accountRoom("VENDOR", restaurant.id)).emit("order:new", eventData);
//     io.to(accountRoom("USER", user.id)).emit("order:created", eventData);
//     res.status(201).json({ success: true, data: eventData });
//   }),
// );

// orderRouter.get(
//   "/orders",
//   authorize("USER"),
//   asyncHandler(async (req, res) => {
//     const orders = await db.query.orderTable.findMany({
//       where: eq(orderTable.customerId, req.account!.id),
//       orderBy: [desc(orderTable.createdAt)],
//       with: { orderItems: true, restorant: true, deliverAssignment: true },
//     });
//     res.status(200).json({
//       success: true,
//       data: orders.map(({ deliveryOtp: _deliveryOtp, ...order }) => order),
//     });
//   }),
// );

// orderRouter.get(
//   "/vendor/orders",
//   authorize("VENDOR"),
//   asyncHandler(async (req, res) => {
//     const orders = await db.query.orderTable.findMany({
//       where: eq(orderTable.restorantId, req.account!.id),
//       orderBy: [desc(orderTable.createdAt)],
//       with: { orderItems: true },
//     });
//     res.status(200).json({
//       success: true,
//       data: orders.map(({ deliveryOtp: _deliveryOtp, ...order }) => order),
//     });
//   }),
// );

// orderRouter.post(
//   "/vendor/orders/:orderId/accept",
//   authorize("VENDOR"),
//   asyncHandler(async (req, res) => {
//     const [order] = await db
//       .update(orderTable)
//       .set({ status: "ACCEPTED" })
//       .where(
//         and(
//           eq(orderTable.id, req.params.orderId),
//           eq(orderTable.restorantId, req.account!.id),
//           eq(orderTable.status, "PENDING_VENDOR"),
//         ),
//       )
//       .returning();
//     if (!order) {
//       throw new ApiError(409, "Order is no longer awaiting acceptance", "ORDER_STATE_CONFLICT");
//     }

//     const { deliveryOtp: _deliveryOtp, ...visibleOrder } = order;
//     const io = getRealtimeServer(req);
//     io.to("admin:orders").emit("order:readyForAssignment", visibleOrder);
//     io.to(accountRoom("USER", order.customerId)).emit("order:accepted", visibleOrder);
//     res.status(200).json({ success: true, data: visibleOrder });
//   }),
// );

// orderRouter.post(
//   "/vendor/orders/:orderId/decline",
//   authorize("VENDOR"),
//   asyncHandler(async (req, res) => {
//     const { reason } = declineSchema.parse(req.body);
//     const [order] = await db
//       .update(orderTable)
//       .set({ status: "DECLINED", failureReason: "Failed By Restorant" })
//       .where(
//         and(
//           eq(orderTable.id, req.params.orderId),
//           eq(orderTable.restorantId, req.account!.id),
//           eq(orderTable.status, "PENDING_VENDOR"),
//         ),
//       )
//       .returning();
//     if (!order) {
//       throw new ApiError(409, "Order is no longer awaiting acceptance", "ORDER_STATE_CONFLICT");
//     }
//     const io = getRealtimeServer(req);
//     io.to(accountRoom("USER", order.customerId)).emit("order:declined", {
//       orderId: order.id,
//       reason,
//     });
//     io.to("admin:orders").emit("order:declined", { orderId: order.id });
//     res.status(200).json({
//       success: true,
//       data: { id: order.id, status: order.status, reason },
//     });
//   }),
// );

// orderRouter.get(
//   "/rider/orders",
//   authorize("RIDER"),
//   asyncHandler(async (req, res) => {
//     const assignments = await db
//       .select({
//         assignment: deliveryAssignmentTable,
//         order: orderTable,
//         restaurant: restorantTable,
//       })
//       .from(deliveryAssignmentTable)
//       .innerJoin(orderTable, eq(deliveryAssignmentTable.orderId, orderTable.id))
//       .innerJoin(restorantTable, eq(orderTable.restorantId, restorantTable.id))
//       .where(eq(deliveryAssignmentTable.riderId, req.account!.id))
//       .orderBy(desc(deliveryAssignmentTable.createdAt));
//     res.status(200).json({
//       success: true,
//       data: assignments.map(({ order, ...assignment }) => ({
//         ...assignment,
//         order: {
//           ...order,
//           deliveryOtp: undefined,
//         },
//       })),
//     });
//   }),
// );

// orderRouter.patch(
//   "/rider/orders/:orderId/status",
//   authorize("RIDER"),
//   asyncHandler(async (req, res) => {
//     const payload = z
//       .object({
//         status: z.enum(["PICKED_UP", "DELIVERED"]),
//         deliveryOtp: z.string().regex(/^\d{6}$/).optional(),
//       })
//       .parse(req.body);
//     const [assignment] = await db
//       .select()
//       .from(deliveryAssignmentTable)
//       .where(
//         and(
//           eq(deliveryAssignmentTable.orderId, req.params.orderId),
//           eq(deliveryAssignmentTable.riderId, req.account!.id),
//         ),
//       )
//       .limit(1);
//     if (!assignment) {
//       throw new ApiError(404, "Delivery assignment not found", "ASSIGNMENT_NOT_FOUND");
//     }

//     const expectedCurrent = payload.status === "PICKED_UP" ? "ASSIGNED" : "PICKED_UP";
//     const [order] = await db
//       .select()
//       .from(orderTable)
//       .where(eq(orderTable.id, req.params.orderId))
//       .limit(1);
//     if (!order || order.status !== expectedCurrent) {
//       throw new ApiError(409, "Order cannot be updated to this status", "ORDER_STATE_CONFLICT");
//     }
//     if (
//       payload.status === "DELIVERED" &&
//       payload.deliveryOtp !== order.deliveryOtp
//     ) {
//       throw new ApiError(400, "Delivery OTP does not match", "INVALID_DELIVERY_OTP");
//     }

//     const [updatedOrder] = await db
//       .update(orderTable)
//       .set({ status: payload.status })
//       .where(
//         and(
//           eq(orderTable.id, req.params.orderId),
//           eq(orderTable.status, expectedCurrent),
//         ),
//       )
//       .returning();
//     if (!updatedOrder) {
//       throw new ApiError(409, "Order status changed concurrently", "ORDER_STATE_CONFLICT");
//     }
//     if (payload.status === "DELIVERED") {
//       await db
//         .update(deliveryAssignmentTable)
//         .set({ status: "order deliverd" })
//         .where(eq(deliveryAssignmentTable.id, assignment.id));
//       await db
//         .update(riderTable)
//         .set({ isAvailable: true })
//         .where(eq(riderTable.id, req.account!.id));
//     } else {
//       await db
//         .update(deliveryAssignmentTable)
//         .set({ status: "order picked up by rider" })
//         .where(eq(deliveryAssignmentTable.id, assignment.id));
//     }

//     const { deliveryOtp: _deliveryOtp, ...visibleOrder } = updatedOrder;
//     const io = getRealtimeServer(req);
//     io.to(accountRoom("USER", order.customerId)).emit("order:statusUpdated", visibleOrder);
//     io.to("admin:orders").emit("order:statusUpdated", visibleOrder);
//     res.status(200).json({ success: true, data: visibleOrder });
//   }),
// );
