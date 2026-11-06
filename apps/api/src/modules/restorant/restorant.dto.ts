import z from "zod";
import { restorantCategoryEnum } from "../../db/schema/restorant.schema.js";
import { dietCategoryEnum } from "../../db/schema/menuItem.schema.js";
export const restorantCategoryEnumType =  restorantCategoryEnum.enumValues
export const dietCategoryEnumType =  dietCategoryEnum.enumValues
export const MobileSchema = z
  .string()
  .regex(/^(?:\+?91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number")

// export const restorantSignupSchema = z.object({
//   restorantName: z.string().trim().min(3).max(80),
//   restorantImages:z.array(z.string()),
//   category:z.enum(restorantCategoryEnumType),
//   dietCategory:z.enum(dietCategoryEnumType),
//   phone: MobileSchema,
//   location: z.object({
//     latitude: z.number().min(-90).max(90),
//     longitude: z.number().min(-180).max(180),
//   }),
//   address: z.object({
//     houseNo:z.number().optional(),
//     buildingNo:z.number().optional(),
//     area:z.string().optional(),
//     city:z.string().min(4).max(10),
//     pincode:z.number().min(6).max(6)
//   })
// });

// export type LoginUserDto = z.infer<typeof restorantSignupSchema>;

export const LoginRestorantSchema = z.object({
  phone: MobileSchema,
});

export type loginRestorantDto = z.infer<typeof LoginRestorantSchema>;

export const verifyRestorantSchema = z.object({
  phone: MobileSchema,
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type verifyRestorantDto = z.infer<typeof verifyRestorantSchema>;