import PagePlaceholder from "../../components/PagePlaceholder";

export default function CompanyFacilities() {
  return (
    <PagePlaceholder
      title="Our Facilities"
      description="Warehouse, office and distribution facilities across Nepal."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "Facilities" }]}
    />
  );
}
