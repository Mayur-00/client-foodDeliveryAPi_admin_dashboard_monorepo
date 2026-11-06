import { restorantTable } from "../../db/schema/restorant.schema.js";
import { loginRestorantDto, verifyRestorantDto } from "./restorant.dto.js";
type restorant = typeof restorantTable.$inferSelect;

export interface IRestorantServices {
  login: (
    data: loginRestorantDto,
  ) => Promise<{ success:boolean, message:string, restorant?:restorant }>;
  verify: (
    data: verifyRestorantDto,
  ) => Promise<{ success:boolean, message:string, restorant?:restorant, jwt?:string}>;
  getAccount: (
    id: string,
  ) => Promise<restorant>;
}
export interface IRestorantRepository {
  getOneByPhone: (phone: string) => Promise<restorant | undefined>;
  getOneById: (id: string) => Promise<restorant | undefined>;
}
