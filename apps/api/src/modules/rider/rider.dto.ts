import z from "zod";
export const MobileSchema = z
  .string()
  .regex(/^(?:\+?91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number")

export const LoginRiderSchema = z.object({
  phone: MobileSchema,
});

export type loginRiderDto = z.infer<typeof LoginRiderSchema>;

export const verifyRiderSchema = z.object({
  phone: MobileSchema,
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type verifyRiderDto = z.infer<typeof verifyRiderSchema>;