import { Logger } from "winston";
import { DB } from "../../db/index.js";
import { restorantTable } from "../../db/schema/restorant.schema.js";
import { eq } from "drizzle-orm";
import { IRestorantRepository } from "./restorant.types.js";

export class RestorantRepository implements IRestorantRepository{
    constructor(private db:DB, private logger:Logger){};

    async getOneByPhone(phone:string){
        const [restorant] = await this.db.select().from(restorantTable).where(eq(restorantTable.phone, phone));
        return restorant;
    }
    async getOneById(id:string){
        const [restorant] = await this.db.select().from(restorantTable).where(eq(restorantTable.id, id));
        return restorant;
    }
}