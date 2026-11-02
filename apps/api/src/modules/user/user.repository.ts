import { eq } from "drizzle-orm";
import { DB } from "../../db/index.js";
import { userTable } from "../../db/schema/index.js";
import { LoginUserDto } from "./user.dto.js";
import { IUserRepository, userStatusEnumType } from "./user.types.js";

export class UserRepository implements IUserRepository {
  constructor(private db: DB){};
  async findUser(phone: string) {
    const [user] = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.phone, phone))
      .limit(1);
    return user;
  }

  async createUser(data: LoginUserDto) {
    const [user] = await this.db
      .insert(userTable)
      .values({
        name: data.fullName,
        phone: data.phone,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        address: data.address ?? null,
      })
      .returning();
    return user;
  };

  async updateVerificationStatus(phone:string, status:userStatusEnumType){
    const [user] = await this.db.update(userTable).set({status:status}).where(eq(userTable.phone, phone)).returning();
    return user;
  }
  
  async getUserById(id:string){
    const [user] = await this.db.select().from(userTable).where(eq(userTable.id, id));
    return user;
  }


}
