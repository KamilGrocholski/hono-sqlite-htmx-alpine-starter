import { JwtService } from "@/jwt";
import { Session, SessionRepo } from "@/session";
import { User, UserRepo, UserRole } from "@/user";
import { AuthPublicError } from "./errors";

export class AuthService {
  constructor(
    private generateExpiresAt: () => Date,
    private sessionRepo: SessionRepo,
    private userRepo: UserRepo,
    private jwtService: JwtService,
  ) {}

  async registerUser(email: string, password: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (user) {
      throw AuthPublicError.EmailTaken;
    }
    await this.userRepo.create(
      email,
      await this.hashPassword(password),
      UserRole.User,
    );
  }

  async registerAdmin(email: string, password: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (user) {
      throw AuthPublicError.EmailTaken;
    }
    await this.userRepo.create(
      email,
      await this.hashPassword(password),
      UserRole.Admin,
    );
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw AuthPublicError.EmailDoesNotExist;
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw AuthPublicError.PasswordInvalid;
    }

    const session = await this.sessionRepo.create(
      user.id,
      this.generateExpiresAt(),
    );

    const token = await this.jwtService.sign({
      userId: user.id,
      sessionId: session.id,
    });
    return token;
  }

  async verifySession(sessionId: Session["id"]): Promise<boolean> {
    const now = new Date();
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) return false;
    return session.expiresAt > now;
  }

  async verifyRole(userId: User["id"], role: UserRole): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw AuthPublicError.UserNotFound;
    }
    return user.role === role;
  }

  async logout(sessionId: Session["id"]): Promise<void> {
    await this.sessionRepo.deleteById(sessionId);
  }

  private async hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }
}
