import HeroSection from "../HeroSection";
import heroImage from "@assets/stock_images/hong_kong_zhuhai_mac_56c5fcf7.jpg";

export default function HeroSectionExample() {
  const featuredProject = {
    id: "hzmb-1",
    name: "Hong Kong-Zhuhai-Macau Bridge",
    location: "Pearl River Delta, China",
    description: "The world's longest sea crossing, spanning 55 kilometers. A marvel of modern engineering connecting Hong Kong, Macau, and mainland China.",
    imageUrl: heroImage,
    rating: 4.8,
    ratingCount: 2340,
  };

  return (
    <HeroSection
      project={featuredProject}
      onRateProject={(id) => console.log(`Rating project: ${id}`)}
    />
  );
}
