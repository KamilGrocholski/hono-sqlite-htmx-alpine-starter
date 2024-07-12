import { Pagination } from "@/utils/pagination";
import { SessionRepo } from "./repo";
import { Session } from "./types";

export class SessionService {
  constructor(private sessionRepo: SessionRepo) {}

  async findPaginated(
    page: number,
    perPage: number,
  ): Promise<Pagination<Session>> {
    return await this.sessionRepo.findPaginated(page, perPage);
  }
}
