import { CaregiverStudio } from "@/app/components/caregiver-studio";
import { getMergedCatalog } from "@/lib/catalog-store";

export default async function CaregiverPage() {
  const catalog = await getMergedCatalog();

  return <CaregiverStudio initialCatalog={catalog} />;
}
