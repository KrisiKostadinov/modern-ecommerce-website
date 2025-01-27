"use server";

import { randomBytes } from "crypto";

/**
 * Generates a confirmation link for user verification.
 *
 * @param id - The unique identifier for the user.
 * @param token - The token to be included in the confirmation link.
 * @returns The generated confirmation link as a string.
 */
export const generateConfirmationLink = async (id: string, token: string): Promise<string> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const confirmationLink = `${baseUrl}/confirm/${id}?token=${token}`;

  return confirmationLink;
};

/**
 * Generates a random token of the specified length.
 *
 * @param length - The length of the token to be generated. Default is 32.
 * @returns The generated token as a hexadecimal string.
 */
export const generateToken = async (length: number = 32): Promise<string> => {
  const buffer = randomBytes(length);
  const token = buffer.toString("hex");
  return token;
};
