import { useParams } from "react-router-dom";
import PagePlaceholder from "../components/PagePlaceholder";

export default function CampaignLanding() {
  const { slug } = useParams<{ slug: string }>();
  const title = (slug || "").replace(/-/g, " ");
  return (
    <PagePlaceholder
      title={title || "Campaign"}
      description="Promotional campaign details and featured products."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: title || "Campaign" }]}
      note="Campaigns will be manageable from the admin dashboard once the Campaign model is added to the backend."
    />
  );
}
