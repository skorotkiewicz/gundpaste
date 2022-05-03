import Editor from "@monaco-editor/react";

const Monaco = ({ setData, ext, data }) => {
  return (
    <Editor
      theme="vs-dark"
      value={data}
      defaultLanguage={ext}
      language={ext}
      onChange={(e) => {
        setData(e.target.value);
      }}
    />
  );
};

export default Monaco;
