import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

export interface CreateUserInput {
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

export interface FindOrCreateUserInput {
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

export class UserService {
  /**
   * Creates a new user in the database.
   * This is the central place for user creation logic.
   * Add any additional business logic here (e.g., sending welcome emails,
   * creating default settings, analytics tracking, etc.)
   */
  static async createUser(input: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        image: input.image,
        emailVerified: input.emailVerified,
      },
    });

    // Future: Add additional user creation logic here
    // - Send welcome email
    // - Create default user settings
    // - Track analytics event
    // - Initialize user preferences

    return user;
  }

  /**
   * Finds an existing user by email or creates a new one.
   * Used by OAuth flows to handle returning and new users.
   */
  static async findOrCreateUser(input: FindOrCreateUserInput): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return existingUser;
    }

    return this.createUser(input);
  }

  /**
   * Finds a user by their ID.
   */
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a user by their email.
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Updates a user's profile information.
   */
  static async updateUser(
    id: string,
    data: Partial<Pick<User, "name" | "image">>
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
