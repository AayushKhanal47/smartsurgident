import { useSiteSettings } from "../hooks/useSiteSettings";
import { useStructuredData } from "../hooks/useStructuredData";
import { organizationSchema } from "../utils/structuredData";

// Mounted once in SiteLayout so every public page carries an
// Organization/LocalBusiness JSON-LD block, built from the same
// /api/site-settings data the Footer already renders — shared via
// useSiteSettings so the two don't fire duplicate requests.
export default function OrganizationSchema() {
  const settings = useSiteSettings();
  useStructuredData("ld-organization", organizationSchema(settings));
  return null;
}
