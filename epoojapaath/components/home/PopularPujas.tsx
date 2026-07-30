import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import { serialize } from "@/lib/utils";
import { PopularPujasClient } from "./PopularPujasClient";

async function getPopularPujas() {
  await connectDB();
  return Puja.find({ isActive: true })
    .populate("temple", "name slug coverImage")
    .sort({ totalBooked: -1 })
    .limit(8)
    .lean();
}

export async function PopularPujas() {
  const pujas = serialize(await getPopularPujas().catch(() => []));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PopularPujasClient pujas={pujas as any} />;
}
