import { UserRepo } from "./repo";
import { User } from "./types";

export class UserService {
  constructor(private userRepo: UserRepo) {}

  async findById(id: User["id"]): Promise<User | null> {
    return await this.userRepo.findById(id);
  }
}
