import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  profilePictureUrl: text("profile_picture_url"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  completionYear: integer("completion_year").notNull(),
  rating: text("rating").default("0").notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
}).partial({ role: true });

export const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  profilePictureUrl: z.string().url().optional(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  location: true,
  description: true,
  imageUrl: true,
  category: true,
  completionYear: true,
});

export const insertRatingSchema = createInsertSchema(ratings).pick({
  projectId: true,
  userId: true,
  rating: true,
  review: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
