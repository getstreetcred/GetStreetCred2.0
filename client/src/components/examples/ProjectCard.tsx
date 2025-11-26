import ProjectCard from "../ProjectCard";
import burjKhalifa from "@assets/stock_images/burj_khalifa_dubai_s_0d086f10.jpg";

export default function ProjectCardExample() {
  const project = {
    id: "burj-1",
    name: "Burj Khalifa",
    location: "Dubai, UAE",
    imageUrl: burjKhalifa,
    rating: 4.9,
    ratingCount: 5420,
    completionYear: 2010,
    category: "Skyscraper",
  };

  return (
    <div className="max-w-sm">
      <ProjectCard
        project={project}
        onClick={(id) => console.log(`Clicked project: ${id}`)}
      />
    </div>
  );
}
