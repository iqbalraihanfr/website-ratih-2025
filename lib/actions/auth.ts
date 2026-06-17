"use server";

/**
 * Checks if a given email is whitelisted in the ADMIN_EMAILS environment variable.
 * This runs securely on the server-side, preventing exposure of the email whitelist to the client.
 */
export async function verifyAdminEmail(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  const allowedEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase());
    
  return allowedEmails.includes(email.toLowerCase());
}
