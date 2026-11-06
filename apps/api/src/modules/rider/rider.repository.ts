import { eq } from "drizzle-orm";
import { DB } from "../../db/index.js";
import { riderTable } from "../../db/schema/rider.schema.js";
import { IRiderRepository } from "./rider.types.js";

export class RiderRepository implements IRiderRepository {
    constructor(private db:DB){};

    async getOneByPhone(phone:string){
        const [rider] = await this.db.select().from(riderTable).where(eq(riderTable.phone, phone));

        return rider;
    };

    async getOneById(id:string){
        const [rider] = await this.db.select().from(riderTable).where(eq(riderTable.id, id));

        return rider;
    }

}