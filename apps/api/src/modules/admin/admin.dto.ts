import z from "zod";
import { restorantCategoryEnum } from "../../db/schema/restorant.schema.js";
import { dietCategoryEnum } from "../../db/schema/menuItem.schema.js";
export const restorantCategoryEnumType =  restorantCategoryEnum.enumValues
export const dietCategoryEnumType =  dietCategoryEnum.enumValues

export const MobileSchema = z
  .string()
  .regex(/^(?:\+?91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number")

export const loginAdminSchema = z.object({
  phone: MobileSchema,
});

export const verifyAdminSchema = z.object({
    phone:MobileSchema,
    otp:z.string().min(6).max(6)
});

export type loginAdminSchemaDto = z.infer<typeof loginAdminSchema>;
export type verifyAdminSchemaDto = z.infer<typeof verifyAdminSchema>;


export const addNewRestorantSchema = z.object({
     restorantName: z.string().trim().min(3).max(80),
      restorantImages:z.string().min(3),
      category:z.enum(restorantCategoryEnumType),
      dietCategory:z.enum(dietCategoryEnumType),
      phone: MobileSchema,
      location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
})

export const blockRestorantSchema = z.object({
    restorantId:z.string()
});

export const addnewRider= z.object({
    name:z.string(),
    phone:MobileSchema,
});

