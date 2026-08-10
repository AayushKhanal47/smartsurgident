import { useParams } from "react-router-dom";
import PagePlaceholder from "../../components/PagePlaceholder";

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <PagePlaceholder
      title="Resource"
      description={`Resource "${slug}" will appear here once the E-Library backend is in place.`}
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "E-Library", to: "/resources" }, { label: slug || "Resource" }]}
    />
  );
}
