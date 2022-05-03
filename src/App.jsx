import { useEffect, useState, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.scss";
import Gun from "gun/gun";
import SEA from "gun/sea";
import Languages from "./components/Languages";
import { B64ToText, TextToB64 } from "./utils";

const Monaco = lazy(() => import("./components/Monaco"));
const CodeArea = lazy(() => import("./components/CodeArea"));

let gun = Gun();
gun.opt({
  peers: [
    "https://grizzly.de1.hashbang.sh/gun",
    // "https://gun-manhattan.herokuapp.com/gun",
  ],
});

function App() {
  let params = useParams();
  let navigate = useNavigate();
  const [bin, setBin] = useState(params.binId);
  const [bins, setBins] = useState([]);
  const [data, setData] = useState("");
  const [ext, setExt] = useState("jsx");
  const [editor, setEditor] = useState(0);

  useEffect(() => {
    if (!bin) return;

    gun
      .get("grizzly")
      .get("bin")
      .get("#")
      .get(B64ToText(bin))
      .once((d) => {
        if (d) {
          let p = JSON.parse(d);
          if (p.ext && p.data) {
            setData(p.data);
            setExt(p.ext);
          } else {
            setData(d);
          }
        }
      });
  }, [bin]);

  return (
    <div className="container">
      <header>
        <span>~decentralized p2p pastebin</span>
        <button onClick={() => setEditor((prev) => !prev)}>
          Switch to {editor ? "simple" : "monaco (vscode)"} editor
        </button>
      </header>
      <main>
        <div className="area">
          <Suspense fallback={"Loading..."}>
            {editor ? (
              <Monaco setData={setData} ext={ext} data={data} />
            ) : (
              <CodeArea setData={setData} ext={ext} data={data} />
            )}
          </Suspense>
        </div>
        <div className="side">
          <Languages ext={ext} setExt={setExt} editor={editor} />

          {bin && (
            <button
              onClick={() => {
                setData("");
                navigate("/");
              }}
            >
              New Bin
            </button>
          )}

          <button
            onClick={async () => {
              let paste = JSON.stringify({ data, ext });

              let hash = await SEA.work(paste, null, null, {
                name: "SHA-256",
              });

              gun.get("grizzly").get("bin").get("#").get(hash).put(paste);

              setBin(TextToB64(hash));
              if (!bins.includes(TextToB64(hash)))
                setBins((prev) => [TextToB64(hash), ...prev]);

              navigate("/" + TextToB64(hash));
            }}
          >
            Save Pernamentally
          </button>

          {bins.length > 0 && (
            <div className="bins">
              <div style={{ color: "#aaa", margin: 10 }}>your bins</div>

              {bins.map((b, k) => (
                <div
                  className="bin"
                  key={k}
                  onClick={() => {
                    setBin(b);
                    navigate("/" + b);
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer>
        <a
          href="https://github.com/skorotkiewicz/gundpaste"
          target="_blank"
          rel="noreferrer"
        >
          open-source
        </a>
      </footer>
    </div>
  );
}

export default App;
