import { WorkbookApp } from "@/app/components/workbook-app";
import { getMergedCatalog } from "@/lib/catalog-store";

export default async function HomePage() {
  const catalog = await getMergedCatalog();

  return <WorkbookApp initialCatalog={catalog} />;
}
