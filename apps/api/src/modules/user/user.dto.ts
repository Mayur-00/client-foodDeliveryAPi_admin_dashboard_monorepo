import z from "zod";

export const MobileSchema = z
  .string()
  .regex(/^(?:\+?91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number")

export const LoginUserSchema = z.object({
  fullName: z.string().trim().min(3).max(80),
  phone: MobileSchema,
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  address: z.string().trim().max(500).optional(),
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;

export const VerifyUserSchema = z.object({
  phone: MobileSchema,
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});
