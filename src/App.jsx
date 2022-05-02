import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.scss";
import Gun from "gun/gun";
import { nanoid } from "nanoid";

let gun = Gun();
gun.opt({
  peers: [
    "https://grizzly.de1.hashbang.sh/gun",
    "https://gun-manhattan.herokuapp.com/gun",
  ],
});

function App() {
  let params = useParams();
  let navigate = useNavigate();
  const [bin, setBin] = useState(params.binId);
  const [bins, setBins] = useState([]);
  const [data, setData] = useState("");

  useEffect(() => {
    if (!bin) return;

    gun
      .get("grizzly")
      .get("bin")
      .get(bin)
      .once((data) => {
        if (data) setData(data);
      });

    gun
      .get("grizzly")
      .get("bin")
      .get(bin)
      .on((data) => {
        if (data) setData(data);
      });
  }, [bin]);

  useEffect(() => {
    if (!bin || !data) return;

    let timeout = setTimeout(() => {
      if (data) gun.get("grizzly").get("bin").get(bin).put(data);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const newId = () => {
    const id = nanoid(10);
    setBin(id);
    setData("");
    navigate("/bin/" + id);
    return id;
  };

  return (
    <div className="container">
      <header>~decentralized p2p pastebin</header>
      <main>
        <div className="area">
          <textarea
            value={data}
            placeholder="paste here!"
            onChange={(e) => {
              setData(e.target.value);

              if (!params.binId) {
                const id = newId();
                gun.get("grizzly").get("bin").get(id).put(e.target.value);
                setBins((prev) => [id, ...prev]);
              }
            }}
          ></textarea>
        </div>
        <div className="side">
          <button
            onClick={() => {
              setBins((prev) => [newId(), ...prev]);
            }}
          >
            Add new bin
          </button>

          <div className="bins">
            {bins.map((b, k) => (
              <div
                className="bin"
                key={k}
                onClick={() => {
                  setBin(b);
                  navigate("/bin/" + b);
                }}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* <footer>Footer</footer> */}
    </div>
  );
}

export default App;
