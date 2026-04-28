import { User } from "./user.model.domain";

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  
}