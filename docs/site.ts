import { BRAND } from "./brand";
/* Filled in at build time. On Vercel these come from the project automatically. */
declare const __GITHUB_URL__: string;
export const GITHUB_URL: string = typeof __GITHUB_URL__ === "string" ? __GITHUB_URL__ : "";
export const REGISTRY_URL = (typeof location !== "undefined" && location.protocol.startsWith("http") ? location.origin : BRAND.url) + "/r";
