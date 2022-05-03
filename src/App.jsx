import { useEffect, useState, Suspense, lazy, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (localStorage.getItem("dpaste") && loaded.current === false)
      setBins(JSON.parse(localStorage.getItem("dpaste")));

    if (bins.length > 0) localStorage.setItem("dpaste", JSON.stringify(bins));

    loaded.current = true;
  }, [bins]);

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
              if (!data) return;
              setLoading(true);

              let paste = JSON.stringify({ data, ext });

              let hash = await SEA.work(paste, null, null, {
                name: "SHA-256",
              });
              let b64Hash = TextToB64(hash);
              let title = `[${ext}] - ${data.substring(0, 10)}`;

              gun
                .get("grizzly")
                .get("bin")
                .get("#")
                .get(hash)
                .put(paste, (res) => {
                  if (res.ok) {
                    setBin(b64Hash);

                    if (!bins.some((e) => e.id === b64Hash))
                      setBins((prev) => [{ title, id: b64Hash }, ...prev]);

                    navigate("/" + b64Hash);
                  }
                  setLoading(false);
                });
            }}
          >
            {loading ? "Saving..." : "Save Pernamentally"}
          </button>

          {bins.length > 0 && (
            <div className="bins">
              <div className="head">
                <span>your bins</span>

                <span
                  className="clear"
                  onClick={() => {
                    setBins([]);
                    localStorage.removeItem("dpaste");
                  }}
                >
                  clear
                </span>
              </div>

              {bins.map((b, k) => (
                <div
                  className="bin"
                  key={k}
                  onClick={() => {
                    setBin(b.id);
                    navigate("/" + b.id);
                  }}
                >
                  {b.title}
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
