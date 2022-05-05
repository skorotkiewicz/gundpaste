import CodeEditor from "@uiw/react-textarea-code-editor";
import { ICodeArea } from "../interfaces";

const CodeArea = ({ data, ext, setData }: ICodeArea) => {
  return (
    <CodeEditor
      value={data}
      language={ext}
      placeholder="Enter your content."
      onChange={(e) => {
        setData(e.target.value);
      }}
      padding={15}
      style={{
        height: "100%",
        fontSize: 12,
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
    />
  );
};

export default CodeArea;
