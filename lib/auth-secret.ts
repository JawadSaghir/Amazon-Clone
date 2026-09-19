const DEMO_AUTH_SECRET = "8x-marketplace-demo-auth-secret-change-before-production";

export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || DEMO_AUTH_SECRET;
}
