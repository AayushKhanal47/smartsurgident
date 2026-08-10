import { useParams } from "react-router-dom";
import PagePlaceholder from "../../components/PagePlaceholder";

export default function DealerDetail() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <PagePlaceholder
      title="Dealer profile"
      description={`Profile for "${slug}" will appear here once dealer data is available.`}
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Dealer Network", to: "/dealers" }, { label: slug || "Dealer" }]}
    />
  );
}
