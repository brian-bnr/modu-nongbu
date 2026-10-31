"use server";

import { cookies } from "next/headers";

const REGION_COOKIE = "region";

export async function setRegionAction(region: string) {
  const cookieStore = await cookies();
  if (region) {
    cookieStore.set(REGION_COOKIE, region, {
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
  } else {
    cookieStore.delete(REGION_COOKIE);
  }
}
