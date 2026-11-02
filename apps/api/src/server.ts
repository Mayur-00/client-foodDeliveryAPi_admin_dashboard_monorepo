// import "dotenv/config";
// import { createServer } from "node:http";
// import jwt from "jsonwebtoken";
// import { Server } from "socket.io";
// import { app } from "./app.js";
// import { db } from "./db/index.js";
// import { restorantTable, riderTable, userTable } from "./db/schema/index.js";
// import { eq } from "drizzle-orm";
// import { ApiError } from "./utils/apiError.js";
// import {
//   AccountRole,
//   AuthTokenPayload,
//   getTokenSecret,
// } from "./utils/jwt.utils.js";
// import { accountRoom } from "./utils/realtime.js";

// const port = Number.parseInt(process.env.PORT ?? "5000", 10);
// if (!Number.isInteger(port) || port < 1 || port > 65535) {
//   throw new Error("PORT must be a valid TCP port");
// }

// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: (process.env.FRONTEND_URL ?? "")
//       .split(",")
//       .map((origin) => origin.trim())
//       .filter(Boolean),
//     credentials: true,
//   },
// });
// app.set("io", io);

// const roles: AccountRole[] = ["ADMIN", "USER", "VENDOR", "RIDER"];

// io.use(async (socket, next) => {
//   const token: unknown = socket.handshake.auth.token;
//   if (typeof token !== "string") {
//     next(new Error("Authentication required"));
//     return;
//   }

//   const decoded = jwt.decode(token);
//   if (
//     !decoded ||
//     typeof decoded === "string" ||
//     typeof decoded.role !== "string" ||
//     !roles.includes(decoded.role as AccountRole)
//   ) {
//     next(new Error("Invalid access token"));
//     return;
//   }

//   try {
//     const role = decoded.role as AccountRole;
//     const payload = jwt.verify(token, getTokenSecret(role));
//     if (
//       typeof payload === "string" ||
//       payload.role !== role ||
//       typeof payload.id !== "string" ||
//       typeof payload.name !== "string"
//     ) {
//       throw new ApiError(401, "Invalid access token");
//     }

//     if (role === "USER") {
//       const [user] = await db
//         .select({ isVerified: userTable.isVerified, isBlocked: userTable.isBlocked })
//         .from(userTable)
//         .where(eq(userTable.id, payload.id))
//         .limit(1);
//       if (!user?.isVerified || user.isBlocked) {
//         throw new ApiError(403, "User account is not allowed", "ACCOUNT_BLOCKED");
//       }
//     } else if (role === "VENDOR") {
//       const [vendor] = await db
//         .select({
//           isVerified: restorantTable.isVerified,
//           isApproved: restorantTable.isApproved,
//         })
//         .from(restorantTable)
//         .where(eq(restorantTable.id, payload.id))
//         .limit(1);
//       if (!vendor?.isVerified || !vendor.isApproved) {
//         throw new ApiError(403, "Vendor is not approved", "VENDOR_NOT_APPROVED");
//       }
//     } else if (role === "RIDER") {
//       const [rider] = await db
//         .select({ isVerified: riderTable.isVerified })
//         .from(riderTable)
//         .where(eq(riderTable.id, payload.id))
//         .limit(1);
//       if (!rider?.isVerified) {
//         throw new ApiError(403, "Rider account is not verified", "ACCOUNT_NOT_VERIFIED");
//       }
//     }

//     socket.data.account = payload as AuthTokenPayload;
//     next();
//   } catch {
//     next(new Error("Invalid or expired access token"));
//   }
// });

// io.on("connection", (socket) => {
//   const account = socket.data.account as AuthTokenPayload;
//   if (account.role === "ADMIN") {
//     void socket.join("admin:orders");
//   } else {
//     void socket.join(accountRoom(account.role, account.id));
//   }
// });

// server.listen(port, "0.0.0.0", () => {
//   console.log(`API and Socket.IO server listening on port ${port}`);
// });



  import { app } from "./app.js";
  import dotenv from "dotenv";
  dotenv.config();

  const PORT = parseInt( process.env.PORT || "5000 " ,10) 

  app.listen(PORT, '0.0.0.0' , () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
