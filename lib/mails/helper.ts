import path from "path";
import fs from "node:fs/promises";

export function replaceVariables(
  template: string,
  values: Record<string, string>
): { success: boolean; result: string } {
  try {
    const result = template.replace(/{{(\w+)}}/g, (match, key) => {
      if (key in values) {
        return values[key];
      } else {
        throw new Error(`Missing value for key: ${key}`);
      }
    });
    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, result: error.message };
    }

    return { success: false, result: "An unknown error occurred." };
  }
}

export async function loadHtmlFile(filename: string) {
  const filePath = path.join(process.cwd(), 'html-templates', `${filename}.html`);
  const html = await fs.readFile(filePath, 'utf-8');
  return html;
}