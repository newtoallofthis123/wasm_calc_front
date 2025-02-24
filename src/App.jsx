import { useState, useEffect } from "react";
import "./App.css";
import init, { evaluate } from "./wasm/pkg/rust_calculator";
function App() {
  const [expression, setExpression] = useState("23 + 8");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [wasmReady, setWasmReady] = useState(false);
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
          <h2>Wa-some Calculator</h2>
          {wasmReady ? (
            <>
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              />
              <button onClick={calculate}>Calculate</button>
              {error && <p style={{ color: "red" }}>Error: {error}</p>}
              {result && <p>Result: {result}</p>}
            </>
    </div>
  );
}

export default App;
