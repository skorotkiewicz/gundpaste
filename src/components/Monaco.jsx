import { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import monacoThemes from "monaco-themes/themes/themelist";
import Loading from "./Loading";

const Monaco = ({ setData, ext, data, theme }) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      import(`monaco-themes/themes/${monacoThemes[theme]}.json`).then(
        (data) => {
          monaco.editor.defineTheme(theme, data);
          monaco.editor.setTheme(theme);
        }
      );
    }
  }, [monaco, theme]);

  return (
    <Editor
      theme={theme}
      loading={<Loading />}
      defaultValue={data}
      defaultLanguage={ext}
      language={ext}
      onChange={(e) => {
        setData(e);
      }}
    />
  );
};

export default Monaco;
