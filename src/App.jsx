import { useState, useEffect } from "react";
import "./App.css";
import init, { evaluate } from "./wasm/pkg/rust_calculator";
import WebGLScene from "./gl_loader";

function App() {
  const [expression, setExpression] = useState("23 + 8");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [wasmReady, setWasmReady] = useState(false);
  const [tab, setTab] = useState(0);
  const vertex = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;
  const [fragment, setFragment] = useState("");
  const [input, setInput] = useState("");

  async function submit() {
    const res = await fetch("http://localhost:4000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: input,
    }).catch((err) => console.error(err));
    const jRes = await res.json();
    const modelRes = JSON.parse(jRes["content"][0]["text"]);
    console.log(modelRes);
    setFragment(modelRes["frag"]);
  }

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await init();
        setWasmReady(true);
      } catch (e) {
        console.error("Failed to initialize WASM:", e);
        setError("Failed to initialize WASM.");
      }
    };

    loadWasm();
  }, []);

  const calculate = () => {
    if (!wasmReady) {
      setError("WASM is still loading.");
      return;
    }

    try {
      const res = evaluate(expression);
      if (typeof res === "string" && res.startsWith("Err")) {
        setError(res);
        setResult("");
      } else {
        setResult(res);
        setError("");
      }
    } catch (e) {
      console.error("Error calculating expression:", e);
      setError("Error calculating expression.");
      setResult("");
    }
  };

  return (
    <div className="App">
      <div>
        <button onClick={() => setTab(0)}>Wasm Calculator</button>
        <button onClick={() => setTab(1)}>WebGL</button>
      </div>
      {tab === 0 ? (
        <div>
          <h2>Wa-some Calculator</h2>
          {wasmReady ? (
            <>
              <input
                type="text"
                style={{ width: "50%", padding: "10px", fontSize: "1.1em" }}
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              />
              <button onClick={calculate}>Calculate</button>
              {error && <p style={{ color: "red" }}>Error: {error}</p>}
              {result && <p>Result: {result}</p>}
            </>
          ) : (
            <p>Loading Wasm...</p>
          )}
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Try saying a simple red square..."
            style={{ width: "50%", padding: "10px", fontSize: "1.1em" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={submit}>Submit</button>
          <p>Responses are inaccurate for spheres and complex shapes.</p>
          <code>
            <pre>Vertex Shader:</pre>
            <pre style={{ whiteSpace: "pre-wrap" }}>{vertex}</pre>
            <pre>Fragment Shader:</pre>
            <pre style={{ whiteSpace: "pre-wrap" }}>{fragment}</pre>
          </code>
          <div>
            <WebGLScene
              key={`${vertex}-${fragment}`}
              vertShader={vertex}
              fragShader={fragment}
            />
          </div>
        </div>
      )}
      Made by <a href="https://noobscience.in">NoobScience</a> for InVideo
    </div>
  );
}

export default App;
