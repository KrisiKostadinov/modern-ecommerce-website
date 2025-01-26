import fs from "node:fs";

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

export function loadHtmlFile(filename: string) {
  const html = fs.readFileSync(
    process.cwd() + `/html-templates/${filename}.html`,
    "utf-8"
  );
  return html;
}
