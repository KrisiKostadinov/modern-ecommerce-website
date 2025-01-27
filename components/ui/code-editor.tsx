"use client";

import Editor from "@monaco-editor/react";

const DEFAULT_LANGUAGE = "html";

type CodeEditorProps = {
  language?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  height?: string;
  theme?: "vs-light" | "vs-dark";
};

export default function CodeEditor({
  language = DEFAULT_LANGUAGE,
  value = "",
  onChange,
  height = "90vh",
  theme = "vs-light",
}: CodeEditorProps) {
  const handleChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Editor
      height={height}
      defaultLanguage={DEFAULT_LANGUAGE}
      language={language ?? DEFAULT_LANGUAGE}
      onChange={handleChange}
      defaultValue={value}
      theme={theme}
    />
  );
}
