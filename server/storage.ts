import { type User, type InsertUser, type Project, type InsertProject, type Rating, type InsertRating } from "@shared/schema";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase client lazily
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith("https://")) {
      try {
        supabase = createClient(supabaseUrl, supabaseKey);
      } catch (error) {
        console.error("Failed to initialize Supabase client:", error);
        return null;
      }
    }
  }
  return supabase;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser, role?: string): Promise<User>;
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject, userId?: string): Promise<Project>;
  updateProject(id: string, project: InsertProject): Promise<Project>;
  submitRating(rating: InsertRating): Promise<Rating>;
  getRatingsForProject(projectId: string): Promise<Rating[]>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const sb = getSupabaseClient();
    if (!sb) throw new Error("Supabase not configured");
    
    const { data, error } = await sb
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const sb = getSupabaseClient();
    if (!sb) throw new Error("Supabase not configured");
    
    const cleanUsername = username.trim().toLowerCase();
    
    const { data, error } = await sb
      .from("users")
      .select("*")
      .eq("username", cleanUsername);
    
    if (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
    
    const users = (data as User[]) || [];
    if (users.length === 0) {
      return undefined;
    }
    return users[0];
  }

  async createUser(insertUser: InsertUser, role: string = "user"): Promise<User> {
    const sb = getSupabaseClient();
    if (!sb) throw new Error("Supabase not configured");
    
    const userData = { ...insertUser, role };
    const { data, error } = await sb
      .from("users")
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }
    return data as User;
  }

  async getProjects(): Promise<Project[]> {
    const sb = getSupabaseClient();
    if (!sb) {
      console.warn("Supabase not configured, returning empty projects list");
      return [];
    }
    
    const { data, error } = await sb
      .from("projects")
      .select("*");
    
    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
    return (data as Project[]) || [];
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    const sb = getSupabaseClient();
    if (!sb) return [];
    
    const { data, error } = await sb
      .from("projects")
      .select("*")
      .eq("category", category);
    
    if (error) {
      console.error("Error fetching projects by category:", error);
      return [];
    }
    return (data as Project[]) || [];
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const sb = getSupabaseClient();
    if (!sb) return undefined;
    
    const { data, error } = await sb
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching project:", error);
      return undefined;
    }
    return data as Project;
  }

  async createProject(project: InsertProject, userId?: string): Promise<Project> {
    const sb = getSupabaseClient();
    if (!sb) throw new Error("Supabase not configured");
    
    // Transform camelCase to snake_case for Supabase
    const projectData = {
      name: project.name,
      location: project.location,
      description: project.description,
      image_url: project.imageUrl,
      category: project.category,
      completion_year: project.completionYear,
      ...(userId && { user_id: userId }),
    };
    
    const { data, error } = await sb
      .from("projects")
      .insert([projectData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }
    return data as Project;
  }

  async updateProject(id: string, project: InsertProject): Promise<Project> {
    const sb = getSupabaseClient();
    if (!sb) throw new Error("Supabase not configured");
    
    // Transform camelCase to snake_case for Supabase
    const projectData = {
      name: project.name,
      location: project.location,
      description: project.description,
      image_url: project.imageUrl,
      category: project.category,
      completion_year: project.completionYear,
    };
    
    const { data, error } = await sb
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }
    return data as Project;
  }

  async submitRating(rating: InsertRating): Promise<Rating> {
    const sb = getSupabaseClient();
    if (!sb) throw new Error("Supabase not configured");
    
    // Transform camelCase to snake_case for Supabase
    const ratingData = {
      project_id: rating.projectId,
      user_id: rating.userId,
      rating: rating.rating,
      review: rating.review || null,
    };
    
    // Insert the rating
    const { data: submittedRating, error: ratingError } = await sb
      .from("ratings")
      .insert([ratingData])
      .select()
      .single();
    
    if (ratingError) {
      console.error("Error submitting rating:", ratingError);
      throw ratingError;
    }

    // Fetch all ratings for this project to calculate average
    const { data: allRatings, error: ratingsError } = await sb
      .from("ratings")
      .select("rating")
      .eq("project_id", rating.projectId);
    
    if (ratingsError) {
      console.error("Error fetching ratings for aggregation:", ratingsError);
      throw ratingsError;
    }

    // Calculate average rating
    const ratings = (allRatings as { rating: number }[]) || [];
    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : "0";

    // Update project with new average rating and count
    const { error: updateError } = await sb
      .from("projects")
      .update({
        rating: averageRating,
        rating_count: ratings.length,
      })
      .eq("id", rating.projectId);
    
    if (updateError) {
      console.error("Error updating project rating:", updateError);
      throw updateError;
    }

    return submittedRating as Rating;
  }

  async getRatingsForProject(projectId: string): Promise<Rating[]> {
    const sb = getSupabaseClient();
    if (!sb) return [];
    
    const { data, error } = await sb
      .from("ratings")
      .select("*")
      .eq("project_id", projectId);
    
    if (error) {
      console.error("Error fetching ratings:", error);
      return [];
    }
    return (data as Rating[]) || [];
  }
}

export const storage = new SupabaseStorage();
