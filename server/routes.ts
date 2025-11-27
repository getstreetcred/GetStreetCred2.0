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

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const { userId, ...projectData } = req.body;
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
      if (userRole !== "admin" && project.user_id !== userId) {
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
      if (userRole !== "admin" && project.user_id !== userId) {
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

  // Seed database with sample projects (admin only)
  app.post("/api/seed-projects", async (req, res) => {
    try {
      const sampleProjects = [
        {
          name: "Burj Khalifa",
          location: "Dubai, UAE",
          description: "Standing at 828 meters, Burj Khalifa is the world's tallest building. This architectural marvel features 163 floors above ground and took 6 years to construct, showcasing the pinnacle of modern engineering and design.",
          imageUrl: "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800",
          category: "Skyscraper",
          completionYear: 2010,
        },
        {
          name: "Shanghai Tower",
          location: "Shanghai, China",
          description: "Shanghai Tower is a 632-meter supertall skyscraper featuring a unique twisted design that reduces wind loads. It houses offices, hotels, and observation decks with stunning views of the Pudong skyline.",
          imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
          category: "Skyscraper",
          completionYear: 2015,
        },
        {
          name: "Marina Bay Sands",
          location: "Singapore",
          description: "Marina Bay Sands is an integrated resort featuring three 55-story towers topped by a stunning SkyPark. The iconic design includes the world's largest rooftop infinity pool and has become Singapore's most recognizable landmark.",
          imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          category: "Hotel & Casino",
          completionYear: 2010,
        },
        {
          name: "Changi Airport Jewel",
          location: "Singapore",
          description: "Changi Airport's Jewel is a nature-themed entertainment complex featuring the world's tallest indoor waterfall, the Rain Vortex. It seamlessly blends nature, shopping, and aviation in a stunning glass dome.",
          imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
          category: "Airport",
          completionYear: 2019,
        },
        {
          name: "Tokyo Skytree",
          location: "Tokyo, Japan",
          description: "Tokyo Skytree stands at 634 meters as Japan's tallest structure. This broadcasting tower combines traditional Japanese aesthetics with cutting-edge technology and offers panoramic views of Tokyo from its observation decks.",
          imageUrl: "https://images.unsplash.com/photo-1540959375944-7049f642e9a0?w=800",
          category: "Tower",
          completionYear: 2012,
        },
        {
          name: "Dubai Downtown District",
          location: "Dubai, UAE",
          description: "Dubai Downtown is a large-scale urban development centered around the Burj Khalifa. It features world-class shopping, dining, and entertainment venues, representing the height of modern urban planning.",
          imageUrl: "https://images.unsplash.com/photo-1518162165786-8a9f0b3d9f1b?w=800",
          category: "Urban Development",
          completionYear: 2020,
        },
        {
          name: "Hong Kong-Zhuhai-Macau Bridge",
          location: "Pearl River Delta, China",
          description: "The Hong Kong-Zhuhai-Macau Bridge is the world's longest sea crossing at 55 kilometers. This engineering masterpiece includes undersea tunnels and artificial islands, reducing travel time between the three cities significantly.",
          imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
          category: "Bridge",
          completionYear: 2018,
        },
      ];

      const insertedProjects = [];
      for (const project of sampleProjects) {
        const inserted = await storage.createProject({
          ...project,
        });
        insertedProjects.push(inserted);
      }

      res.status(201).json({
        message: `Successfully seeded ${insertedProjects.length} projects`,
        projects: insertedProjects,
      });
    } catch (error) {
      console.error("Error seeding projects:", error);
      res.status(500).json({ error: "Failed to seed projects" });
    }
  });

  // Get user's created projects
  app.get("/api/user-projects/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const projects = await storage.getProjects();
      const userProjects = projects.filter(p => p.user_id === userId);
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
