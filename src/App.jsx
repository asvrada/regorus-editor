import { useEffect } from "react";
import Editor from "@monaco-editor/react";

import init, { Engine } from "regorus";

import "./App.css";

function App() {
  useEffect(() => {
    init().then(() => {
      let engine = new Engine();

      engine.add_policy(
        "hello.rego",
        `
    package test

    message = concat(", ", [input.message, data.message])
`,
      );

      engine.add_data(`{
  "message": "World!"
}`);

      engine.set_input(`{
    "message": "Hello"
  }`);

      let results = engine.eval_query("data.test.message");

      console.log(results);
    });
  }, []);

  return (
    <div>
      {/* Header for things like Evaluate/Format/Publish buttons */}
      <div></div>

      {/* Main Editor body */}
      <div>
        {/* Left window - Rego policy data */}
        <div>
          <Editor
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="// some comment"
          />
        </div>

        {/* Right Column for a list of windows */}
        <div>
          {/* First window - Input */}
          <div></div>

          {/* Second window - Output */}
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default App;
