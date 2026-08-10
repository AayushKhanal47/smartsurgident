import PagePlaceholder from "../../components/PagePlaceholder";

export default function SupportWarranty() {
  return (
    <PagePlaceholder
      title="Warranty"
      description="Warranty terms for equipment and instruments purchased through Smart Surgident."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Support", to: "/support/contact" }, { label: "Warranty" }]}
    />
  );
}
