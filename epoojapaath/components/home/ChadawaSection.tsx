import { connectDB } from "@/lib/db";
import Chadawa from "@/models/Chadawa";
import { serialize } from "@/lib/utils";
import { ChadawaSectionClient } from "./ChadawaSectionClient";

async function getChadawaItems() {
  await connectDB();
  return Chadawa.find({ isActive: true })
    .populate("temple", "name slug")
    .lean();
}

export async function ChadawaSection() {
  const items = serialize(await getChadawaItems().catch(() => []));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ChadawaSectionClient items={items as any} />;
}
