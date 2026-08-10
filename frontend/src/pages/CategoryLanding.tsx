import { useParams } from "react-router-dom";
import PagePlaceholder from "../components/PagePlaceholder";

export default function CategoryLanding() {
  const { slug } = useParams<{ slug: string }>();
  const title = (slug || "").replace(/-/g, " ");
  return (
    <PagePlaceholder
      title={title || "Category"}
      description="Browse products in this category."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: title || "Category" }]}
      note="Category landing pages will pull from the dedicated Category model once it's added to the backend."
    />
  );
}
