import PagePlaceholder from "../../components/PagePlaceholder";

export default function Dealers() {
  return (
    <PagePlaceholder
      title="Dealer Network"
      description="Find an authorized Smart Surgident dealer near you across Nepal."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Dealer Network" }]}
      note="The dealer directory (search, province/city filters, map view) is ready to build — it depends on the extended dealer profile fields (photos, address, hours) being added on the backend first."
    />
  );
}
