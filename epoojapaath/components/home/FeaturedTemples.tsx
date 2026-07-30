import { getFeaturedTemples } from "@/services/temple.service";
import { serialize } from "@/lib/utils";
import { FeaturedTemplesClient } from "./FeaturedTemplesClient";

export async function FeaturedTemples() {
  const temples = serialize(await getFeaturedTemples().catch(() => []));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <FeaturedTemplesClient temples={temples as any} />;
}
