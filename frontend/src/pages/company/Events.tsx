import PagePlaceholder from "../../components/PagePlaceholder";

export default function CompanyEvents() {
  return (
    <PagePlaceholder
      title="Events"
      description="Trade shows, dental events, workshops and exhibitions."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "Events" }]}
    />
  );
}
