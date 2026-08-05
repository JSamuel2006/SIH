import { UserEntity, UserRole } from '../database/models/userModel.js';

export class UserRepository {
  private users: Map<string, UserEntity> = new Map([
    [
      'usr-901',
      {
        id: 'usr-901',
        name: 'Dr. Rajesh Sharma',
        email: 'officer.pune@mohfw.gov.in',
        role: 'ROLE_OFFICER',
        jurisdiction: 'Pune District',
        abhaId: 'ABHA-91-8842-1029-4410',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  ]);

  public async findByEmail(email: string): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) || null;
  }

  public async createUser(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const newUser: UserEntity = {
      id: `usr-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
}

export const userRepository = new UserRepository();
