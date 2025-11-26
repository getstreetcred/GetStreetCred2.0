import { useState } from "react";
import CategoryFilter from "../CategoryFilter";

export default function CategoryFilterExample() {
  const [selected, setSelected] = useState("all");

  return (
    <CategoryFilter
      selectedCategory={selected}
      onSelectCategory={(id) => setSelected(id)}
    />
  );
}
