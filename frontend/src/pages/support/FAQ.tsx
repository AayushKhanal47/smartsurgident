import PagePlaceholder from "../../components/PagePlaceholder";

export default function SupportFAQ() {
  return (
    <PagePlaceholder
      title="Frequently Asked Questions"
      description="Answers to common questions about ordering, delivery and products."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Support", to: "/support/contact" }, { label: "FAQ" }]}
    />
  );
}
