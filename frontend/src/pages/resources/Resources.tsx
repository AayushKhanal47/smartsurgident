import PagePlaceholder from "../../components/PagePlaceholder";

export default function Resources() {
  return (
    <PagePlaceholder
      title="E-Library"
      description="Articles, clinical guides, catalogs, brochures and videos."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "E-Library" }]}
      note="The searchable resource library is ready to build — it depends on the Article/Resource backend model being added first."
    />
  );
}
