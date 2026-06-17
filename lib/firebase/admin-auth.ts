import { createVerify } from "crypto";

interface FirebaseTokenHeader {
  alg?: string;
  kid?: string;
}

interface FirebaseTokenPayload {
  aud?: string;
  email?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  sub?: string;
}

let cachedCertificates: Record<string, string> | null = null;
let cachedUntil = 0;

const decodeBase64UrlJson = <T>(value: string): T => {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
};

const getFirebaseCertificates = async () => {
  if (cachedCertificates && cachedUntil > Date.now()) {
    return cachedCertificates;
  }

  const response = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil sertifikat Firebase.");
  }

  const cacheControl = response.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSeconds = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;

  cachedCertificates = (await response.json()) as Record<string, string>;
  cachedUntil = Date.now() + maxAgeSeconds * 1000;

  return cachedCertificates;
};

const isAdminEmail = (email: string | undefined) => {
  if (!email) return false;

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.toLowerCase());
};

export const verifyFirebaseAdminToken = async (authorizationHeader: string | null) => {
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    throw new Error("Token admin tidak ditemukan.");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error("Format token admin tidak valid.");
  }

  const header = decodeBase64UrlJson<FirebaseTokenHeader>(encodedHeader);
  const payload = decodeBase64UrlJson<FirebaseTokenPayload>(encodedPayload);
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error("Firebase project ID belum dikonfigurasi.");
  }

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Token admin tidak valid.");
  }

  const certificates = await getFirebaseCertificates();
  const certificate = certificates[header.kid];

  if (!certificate) {
    throw new Error("Sertifikat token admin tidak cocok.");
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();

  const signatureIsValid = verifier.verify(certificate, encodedSignature, "base64url");
  const now = Math.floor(Date.now() / 1000);
  const issuer = `https://securetoken.google.com/${projectId}`;

  if (
    !signatureIsValid ||
    payload.aud !== projectId ||
    payload.iss !== issuer ||
    !payload.sub ||
    !payload.exp ||
    payload.exp <= now ||
    !payload.iat ||
    payload.iat > now
  ) {
    throw new Error("Token admin tidak valid atau sudah kedaluwarsa.");
  }

  if (!isAdminEmail(payload.email)) {
    throw new Error("Email tidak terdaftar sebagai administrator.");
  }

  return payload;
};
