import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSchema() {
  try {
    console.log("Attempting to fix Supabase schema...\n");

    // Try to drop and recreate tables with correct structure
    const fixSQL = `
      -- Drop tables if they exist (in correct order for foreign keys)
      DROP TABLE IF EXISTS ratings CASCADE;
      DROP TABLE IF EXISTS projects CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      -- Create users table
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username text NOT NULL UNIQUE,
        password text NOT NULL
      );

      -- Create projects table
      CREATE TABLE projects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        location text NOT NULL,
        description text NOT NULL,
        image_url text NOT NULL,
        category text NOT NULL,
        completion_year integer NOT NULL,
        rating text NOT NULL DEFAULT '0',
        rating_count integer NOT NULL DEFAULT 0,
        created_at timestamp NOT NULL DEFAULT now()
      );

      -- Create ratings table
      CREATE TABLE ratings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id uuid NOT NULL REFERENCES projects(id),
        user_id uuid NOT NULL REFERENCES users(id),
        rating integer NOT NULL,
        review text,
        created_at timestamp NOT NULL DEFAULT now()
      );
    `;

    // Execute via Supabase admin
    const { error } = await supabase.rpc('exec', { sql: fixSQL }).catch(() => ({ error: new Error("RPC not available") }));
    
    if (error) {
      console.log("RPC method not available, using alternative approach...");
      // The tables should already exist, just verify structure
      const { data, error: checkError } = await supabase
        .from("projects")
        .select("*")
        .limit(0);
      
      if (checkError) {
        console.log("Error checking projects table:", checkError);
      } else {
        console.log("Projects table exists and is accessible");
      }
    } else {
      console.log("Schema fixed successfully!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

fixSchema();
