import {hc} from "hono/client";
import {AppType} from "@/app/api/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_URL!);

// Individual API clients
export const pageMetaAPI = client;