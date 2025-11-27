import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertRatingSchema } from "@shared/schema";

// Transform snake_case from Supabase to camelCase for frontend
function transformProject(project: any) {
  return {
    id: project.id,
    name: project.name,
    location: project.location,
    description: project.description,
    imageUrl: project.image_url,
    category: project.category,
    completionYear: project.completion_year,
    rating: project.rating,
    ratingCount: project.rating_count,
    userId: project.user_id,
    createdAt: project.created_at,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects.map(transformProject));
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get projects rated by user
  app.get("/api/rated-projects/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const projects = await storage.getRatedProjectsByUser(userId);
      res.json(projects.map(transformProject));
    } catch (error) {
      console.error("Error fetching rated projects:", error);
      res.status(500).json({ error: "Failed to fetch rated projects" });
    }
  });

  // Get projects by category
  app.get("/api/projects/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const projects = await storage.getProjectsByCategory(category);
      res.json(projects.map(transformProject));
    } catch (error) {
      console.error("Error fetching projects by category:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(transformProject(project));
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create new project (admin only)
  app.post("/api/projects", async (req, res) => {
    try {
      const { userId, userRole, ...projectData } = req.body;
      
      // Check if user is admin
      if (userRole !== "admin") {
        return res.status(403).json({ error: "Only admins can create projects" });
      }
      
      const validatedData = insertProjectSchema.parse(projectData);
      const project = await storage.createProject(validatedData, userId);
      res.status(201).json(transformProject(project));
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ error: "Failed to create project" });
    }
  });

  // Update project (admin or project owner)
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, userRole } = req.body;
      
      // Check permissions
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Allow if admin or if user is the project creator
      if (userRole !== "admin" && project.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized to update this project" });
      }
      
      const validatedData = insertProjectSchema.parse(req.body);
      const updatedProject = await storage.updateProject(id, validatedData);
      res.json(transformProject(updatedProject));
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ error: "Failed to update project" });
    }
  });

  // Delete project (admin or project owner)
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, userRole } = req.body;
      
      // Check permissions
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Allow if admin or if user is the project creator
      if (userRole !== "admin" && project.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized to delete this project" });
      }
      
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(400).json({ error: "Failed to delete project" });
    }
  });

  // Submit rating for a project
  app.post("/api/ratings", async (req, res) => {
    try {
      const validatedData = insertRatingSchema.parse(req.body);
      const rating = await storage.submitRating(validatedData);
      // Fetch updated project to return latest rating data
      const updatedProject = await storage.getProjectById(validatedData.projectId);
      res.status(201).json({ rating, updatedProject: updatedProject ? transformProject(updatedProject) : null });
    } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(400).json({ error: "Failed to submit rating" });
    }
  });

  // Auth endpoints
  app.post("/api/auth/signup", async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email?.trim().toLowerCase();
      password = password?.trim();
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      
      // Check if this email is the admin email
      const adminEmail = "admin@getstreetcred.com";
      const role = email === adminEmail ? "admin" : "user";
      
      const user = await storage.createUser({ username: email, password }, role);
      res.status(201).json({ 
        id: user.id, 
        email: user.username, 
        role: user.role,
        profilePictureUrl: (user as any).profile_picture_url || undefined
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      res.status(400).json({ error: error.message || "Failed to sign up" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email?.trim().toLowerCase();
      password = password?.trim();
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      const user = await storage.getUserByUsername(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.json({ 
        id: user.id, 
        email: user.username, 
        role: user.role,
        profilePictureUrl: (user as any).profile_picture_url || undefined
      });
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(400).json({ error: "Failed to sign in" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      // For now, return null since we don't have session management
      res.json(null);
    } catch (error) {
      res.status(400).json({ error: "Failed to get user" });
    }
  });

  // Get ratings for a project
  app.get("/api/projects/:id/ratings", async (req, res) => {
    try {
      const { id } = req.params;
      const ratings = await storage.getRatingsForProject(id);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  // Get featured project
  app.get("/api/featured-project", async (req, res) => {
    try {
      const project = await storage.getFeaturedProject();
      if (!project) {
        return res.status(404).json({ error: "No featured project" });
      }
      res.json(transformProject(project));
    } catch (error) {
      console.error("Error fetching featured project:", error);
      res.status(500).json({ error: "Failed to fetch featured project" });
    }
  });

  // Set featured project (admin only)
  app.patch("/api/projects/:id/feature", async (req, res) => {
    try {
      const { id } = req.params;
      const { userRole } = req.body;
      
      if (userRole !== "admin") {
        return res.status(403).json({ error: "Only admins can set featured projects" });
      }
      
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      await storage.setFeaturedProject(id);
      res.json({ success: true, message: "Project set as featured" });
    } catch (error) {
      console.error("Error setting featured project:", error);
      res.status(400).json({ error: "Failed to set featured project" });
    }
  });

  // Get user's created projects
  app.get("/api/user-projects/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const projects = await storage.getProjects();
      const userProjects = projects.filter(p => p.userId === userId);
      res.json(userProjects.map(transformProject));
    } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ error: "Failed to fetch user projects" });
    }
  });

  // Update user profile
  app.patch("/api/user/profile", async (req, res) => {
    try {
      const { userId, username, password, profilePictureUrl } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Build update payload with only provided fields
      const updateData: any = {};
      if (username !== undefined && username) {
        updateData.username = username;
      }
      if (password !== undefined && password) {
        updateData.password = password;
      }
      if (profilePictureUrl !== undefined) {
        updateData.profilePictureUrl = profilePictureUrl;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      // Update in Supabase directly with snake_case field names
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.SUPABASE_URL || "",
        process.env.SUPABASE_ANON_KEY || ""
      );

      const updatePayload: any = {};
      if (updateData.username) updatePayload.username = updateData.username;
      if (updateData.password) updatePayload.password = updateData.password;
      if (updateData.profilePictureUrl !== undefined) {
        updatePayload.profile_picture_url = updateData.profilePictureUrl;
      }

      const { data: updatedUser, error } = await sb
        .from("users")
        .update(updatePayload)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.username,
        role: updatedUser.role,
        profilePictureUrl: updatedUser.profile_picture_url,
      });
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      res.status(400).json({ error: error.message || "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
