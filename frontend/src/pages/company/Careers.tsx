import PagePlaceholder from "../../components/PagePlaceholder";

export default function CompanyCareers() {
  return (
    <PagePlaceholder
      title="Careers"
      description="Current opportunities at Smart Surgident."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "Careers" }]}
    />
  );
}
