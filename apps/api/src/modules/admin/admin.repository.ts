import { eq } from "drizzle-orm";
import { DB } from "../../db/index.js";
import { adminTable } from "../../db/schema/admin.schema.js";
import { IAdminRepository } from "./admin.types.js";

export class AdminRepository implements IAdminRepository {
    constructor(private db:DB){};

     async getOneByPhone(phone:string){
            const [admin] = await this.db.select().from(adminTable).where(eq(adminTable.phone, phone));
            return admin;
        }
        async getOneById(id:string){
            const [admin] = await this.db.select().from(adminTable).where(eq(adminTable.id, id));
            return admin;
        }
}