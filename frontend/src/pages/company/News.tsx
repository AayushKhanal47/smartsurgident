import PagePlaceholder from "../../components/PagePlaceholder";

export default function CompanyNews() {
  return (
    <PagePlaceholder
      title="News & Updates"
      description="Company announcements and updates."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "News" }]}
    />
  );
}
