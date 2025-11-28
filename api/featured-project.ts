import { storage } from '../server/storage';

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

export default async function handler(req: any, res: any) {
  try {
    const project = await storage.getFeaturedProject();
    res.json(project ? transformProject(project) : null);
  } catch (error) {
    console.error('Error fetching featured project:', error);
    res.status(500).json({ error: 'Failed to fetch featured project' });
  }
}
