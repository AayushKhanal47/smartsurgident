import PagePlaceholder from "../../components/PagePlaceholder";

export default function CompanyAbout() {
  return (
    <PagePlaceholder
      title="About Smart Surgident"
      description="Our company story, mission and values."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "About" }]}
    />
  );
}
