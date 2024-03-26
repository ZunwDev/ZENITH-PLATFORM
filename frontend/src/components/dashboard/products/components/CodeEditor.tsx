import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { useCallback } from "react";
import { useTheme } from "next-themes";

export default function CodeEditor({ formattedJSON, setJsonData, isReadOnly = false }) {
  const { resolvedTheme, forcedTheme } = useTheme();

  const onChange = useCallback((val) => {
    setJsonData(val);
  }, []);

  return (
    <CodeMirror
      value={formattedJSON}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      theme={forcedTheme ?? (resolvedTheme === "dark" ? githubDark : githubLight)}
      placeholder="Select any category, to get an editable template."
      height={isReadOnly ? "252px" : "100%"}
      extensions={[json()]}
      onChange={!isReadOnly ? onChange : undefined}
      readOnly={isReadOnly}
      basicSetup={{ lineNumbers: !isReadOnly, foldGutter: !isReadOnly }}
    />
  );
}
