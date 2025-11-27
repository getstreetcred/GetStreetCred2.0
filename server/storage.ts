import { type User, type InsertUser, type Project, type InsertProject, type Rating, type InsertRating, users, projects, ratings } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser, role?: string): Promise<User>;
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject, userId?: string): Promise<Project>;
  updateProject(id: string, project: InsertProject): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  submitRating(rating: InsertRating): Promise<Rating>;
  getRatingsForProject(projectId: string): Promise<Rating[]>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const cleanUsername = username.trim().toLowerCase();
    const result = await db.select().from(users).where(eq(users.username, cleanUsername));
    return result[0];
  }

  async createUser(insertUser: InsertUser, role: string = "user"): Promise<User> {
    const result = await db.insert(users).values({
      username: insertUser.username,
      password: insertUser.password,
      role,
    }).returning();
    return result[0];
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.category, category));
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async createProject(project: InsertProject, userId?: string): Promise<Project> {
    const result = await db.insert(projects).values({
      name: project.name,
      location: project.location,
      description: project.description,
      imageUrl: project.imageUrl,
      category: project.category,
      completionYear: project.completionYear,
      userId: userId || null,
    }).returning();
    return result[0];
  }

  async updateProject(id: string, project: InsertProject): Promise<Project> {
    const result = await db.update(projects).set({
      name: project.name,
      location: project.location,
      description: project.description,
      imageUrl: project.imageUrl,
      category: project.category,
      completionYear: project.completionYear,
    }).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async submitRating(rating: InsertRating): Promise<Rating> {
    const result = await db.insert(ratings).values({
      projectId: rating.projectId,
      userId: rating.userId,
      rating: rating.rating,
      review: rating.review || null,
    }).returning();

    const allRatings = await db.select().from(ratings).where(eq(ratings.projectId, rating.projectId));
    const averageRating = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
      : "0";

    await db.update(projects).set({
      rating: averageRating,
      ratingCount: allRatings.length,
    }).where(eq(projects.id, rating.projectId));

    return result[0];
  }

  async getRatingsForProject(projectId: string): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.projectId, projectId));
  }
}

export const storage = new PostgresStorage();
