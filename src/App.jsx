import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import init, { Engine } from "regorus";

import NavBar from "./components/NavBar";
import { REGO_LANGUAGE, SEPARATOR } from "./const";

import "./App.css";

const EXAMPLES = {
  example1: {
    policy: "./examples/example1/example.rego",
    input: "./examples/example1/input.json",
  },
};

/**
 * Load examples from internet
 * @param {{policy: string, input: string, data: string}}
 * @returns {Promise<{policy: string, input: string, data: string}>} Content of given 3 files
 */
async function loadExample({ policy, input, data }) {
  const res1 = await fetch(policy);
  const text1 = await res1.text();

  const res2 = await fetch(input);
  const text2 = await res2.text();

  // Data file is optional, if file missing, default to {}
  let text3 = "{}";
  if (data) {
    const res3 = await fetch(input);
    text3 = await res3.text();
  }

  return {
    policy: text1,
    input: text2,
    data: text3,
  };
}

function App() {
  const [engineReady, setEngineReady] = useState(false);
  const [result, setResult] = useState("");
  const [defaultExample, setDefaultExample] = useState(null);

  const editorPolicyRef = useRef(null);
  const editorInputRef = useRef(null);
  const editorDataRef = useRef(null);
  const editorOutputRef = useRef(null);

  useEffect(() => {
    init().then(() => {
      loadExample(EXAMPLES.example1).then((data) => {
        setDefaultExample(data);
      });

      setEngineReady(true);
    });
  }, []);

  if (!engineReady || defaultExample === null) {
    return <div>Loading...</div>;
  }

  function onClickEvaluate() {
    let policy = editorPolicyRef.current.getValue();
    let files = policy.split(SEPARATOR);

    try {
      let startTime = new Date();
      let engine = new Engine();
      for (let i = 0; i < files.length; ++i) {
        engine.add_policy("policy.rego", files[i]);
      }

      engine.set_input(editorInputRef.current.getValue());
      engine.add_data(editorDataRef.current.getValue());

      let parse_time = new Date() - startTime;
      let results = engine.eval_query("data");
      let elapsed = new Date() - startTime;

      let output = ` - Evaluation took ${elapsed} milliseconds. parse = ${parse_time}, eval = ${elapsed - parse_time}`;
      setResult(output);
      editorOutputRef.current.setValue(results);
    } catch (error) {
      editorOutputRef.current.setValue(error);
    }
  }

  const componentLeftPanel = (
    <div className="flex-auto">
      <Editor
        width="99%"
        height="99%"
        defaultLanguage="Rego"
        defaultValue={defaultExample.policy}
        options={{
          automaticLayout: true,
          minimap: {
            enabled: false,
          },
        }}
        beforeMount={(monaco) => {
          monaco.languages.register({ id: "Rego" });
          monaco.languages.setMonarchTokensProvider("Rego", REGO_LANGUAGE);
        }}
        onMount={(editor) => {
          editorPolicyRef.current = editor;
        }}
      />
    </div>
  );

  const componentRightPanel = (
    <div className="flex flex-auto flex-col space-y-1">
      {/* First window - Input */}
      <div className="panel">
        <div className="title">Input Editor</div>
        <div className="editor">
          <Editor
            width="99%"
            height="99%"
            defaultLanguage="json"
            defaultValue={defaultExample.input}
            options={{
              automaticLayout: true,
              minimap: {
                enabled: false,
              },
            }}
            onMount={(editor) => {
              editorInputRef.current = editor;
            }}
          />
        </div>
      </div>

      {/* Second window - Data */}
      <div className="panel">
        <div className="title">Data Editor</div>
        <div className="editor">
          <Editor
            width="99%"
            height="99%"
            defaultLanguage="json"
            defaultValue={defaultExample.data}
            options={{
              automaticLayout: true,
              minimap: {
                enabled: false,
              },
            }}
            onMount={(editor) => {
              editorDataRef.current = editor;
            }}
          />
        </div>
      </div>

      {/* Third window - Output */}
      <div className="panel">
        <div className="title">Output {result}</div>
        <div className="editor">
          <Editor
            width="99%"
            height="99%"
            defaultLanguage="json"
            defaultValue="// Output goes here"
            options={{
              automaticLayout: true,
              readOnly: true,
              minimap: {
                enabled: false,
              },
            }}
            onMount={(editor) => {
              editorOutputRef.current = editor;
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-slate-300">
      {/* Nav Bar */}
      <NavBar
        callbackEvaluate={onClickEvaluate}
        callbackLoadExample={async () => {
          const { policy, input, data } = await loadExample(EXAMPLES.example1);

          editorPolicyRef.current.setValue(policy);
          editorInputRef.current.setValue(input);
          editorDataRef.current.setValue(data);
        }}
      />

      {/* Main Editor body */}
      <div className="flex flex-auto space-x-4">
        {/* Left window - Rego policy */}
        {componentLeftPanel}

        {/* Right Column for a list of windows */}
        {componentRightPanel}
      </div>
    </div>
  );
}

export default App;
