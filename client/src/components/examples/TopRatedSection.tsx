import TopRatedSection from "../TopRatedSection";
import burjKhalifa from "@assets/stock_images/burj_khalifa_dubai_s_0d086f10.jpg";
import changiJewel from "@assets/stock_images/singapore_changi_air_22d4cc43.jpg";
import hongKongBridge from "@assets/stock_images/hong_kong_zhuhai_mac_56c5fcf7.jpg";
import shanghaiTower from "@assets/stock_images/shanghai_tower_moder_9c776149.jpg";
import marinaBay from "@assets/stock_images/singapore_marina_bay_c37dd08f.jpg";

export default function TopRatedSectionExample() {
  // todo: remove mock functionality
  const topProjects = [
    {
      id: "burj-top",
      rank: 1,
      name: "Burj Khalifa",
      location: "Dubai, UAE",
      imageUrl: burjKhalifa,
      rating: 4.9,
      ratingCount: 5420,
      category: "Skyscraper",
    },
    {
      id: "jewel-top",
      rank: 2,
      name: "Changi Airport Jewel",
      location: "Singapore",
      imageUrl: changiJewel,
      rating: 4.9,
      ratingCount: 2890,
      category: "Airport",
    },
    {
      id: "hzmb-top",
      rank: 3,
      name: "Hong Kong-Zhuhai-Macau Bridge",
      location: "Pearl River Delta, China",
      imageUrl: hongKongBridge,
      rating: 4.8,
      ratingCount: 2340,
      category: "Bridge",
    },
    {
      id: "marina-top",
      rank: 4,
      name: "Marina Bay Sands",
      location: "Singapore",
      imageUrl: marinaBay,
      rating: 4.8,
      ratingCount: 4150,
      category: "Hotel",
    },
    {
      id: "shanghai-top",
      rank: 5,
      name: "Shanghai Tower",
      location: "Shanghai, China",
      imageUrl: shanghaiTower,
      rating: 4.7,
      ratingCount: 3210,
      category: "Skyscraper",
    },
  ];

  return (
    <TopRatedSection
      projects={topProjects}
      onProjectClick={(id) => console.log(`Clicked top rated: ${id}`)}
      onViewAll={() => console.log("View all top rated")}
    />
  );
}
