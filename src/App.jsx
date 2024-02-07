import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import init, { Engine } from "regorus";

import "./App.css";

const SEPARATOR = "\n###POLICY###\n";
const REGO_LANGUAGE = {
  //	  defaultToken: 'invalid',

  keywords: [
    "as",
    "contains",
    "default",
    "else",
    "every",
    "false",
    "if",
    "import",
    "in",
    "not",
    "null",
    "package",
    "set(",
    "some",
    "true",
    "with",
  ],

  brackets: [
    ["{", "}", "delimiter.curly"],
    ["[", "]", "delimiter.square"],
    ["(", ")", "delimiter.parenthesis"],
  ],

  operators: [
    "+",
    "-",
    "*",
    "/",
    "%",
    "&",
    "|",
    ",",
    ";",
    ".",
    ":",
    "<",
    "<=",
    "=",
    "==",
    ">",
    ">=",
    "!",
    "!=",
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  tokenizer: {
    root: [
      [
        /[a-zA-Z'_\?\\][\w'\?\\]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],

      [":=", "keyword"],

      [/"[^\\"]*"/, "string"],
      [/`[^\\`]*`/, "string"],

      // delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],

      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": "",
          },
        },
      ],

      // numbers
      [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
      [/[0-9_]+/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],
      // whitespace
      { include: "@whitespace" },
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/#.*$/, "comment"],
    ],
  },
};

const EXAMPLES = {
  example1: {
    policy: "/examples/example1/example.rego",
    input: "/examples/example1/input.json",
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

const defaultExample = await loadExample(EXAMPLES.example1);

function App() {
  const [engine, setEngine] = useState(null);
  const [result, setResult] = useState("");

  const editorPolicyRef = useRef(null);
  const editorInputRef = useRef(null);
  const editorDataRef = useRef(null);
  const editorOutputRef = useRef(null);

  useEffect(() => {
    init().then(() => {
      setEngine(new Engine());
    });
  }, []);

  if (engine === null) {
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

      let output = `Evaluation took ${elapsed} milliseconds. parse = ${parse_time}, eval = ${elapsed - parse_time}`;
      setResult(output);
      editorOutputRef.current.setValue(results);
    } catch (error) {
      editorOutputRef.current.setValue(error);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-300">
      {/* Header for things like Evaluate/Format/Publish buttons */}
      <header className="my-2 flex flex-none justify-between">
        <h2 className="ml-6 text-2xl font-bold">Regorus Playground</h2>

        <div className="mr-6">
          <button
            className="mx-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={async () => {
              const { policy, input, data } = await loadExample(
                EXAMPLES.example1,
              );

              editorPolicyRef.current.setValue(policy);
              editorInputRef.current.setValue(input);
              editorDataRef.current.setValue(data);
            }}
          >
            Load Example 1
          </button>

          <button
            className="mx-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={onClickEvaluate}
          >
            Evaluate
          </button>

          <a href="https://github.com/microsoft/regorus">GitHub Icon</a>
        </div>
      </header>

      {/* Main Editor body */}
      <div className="flex-auto grow">
        <div className="flex h-full flex-row space-x-4">
          {/* Left window - Rego policy */}
          <div className="flex-auto">
            <Editor
              defaultLanguage="Rego"
              defaultValue={defaultExample.policy}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              beforeMount={(monaco) => {
                monaco.languages.register({ id: "Rego" });
                monaco.languages.setMonarchTokensProvider(
                  "Rego",
                  REGO_LANGUAGE,
                );
              }}
              onMount={(editor) => {
                editorPolicyRef.current = editor;
              }}
            />
          </div>

          {/* Right Column for a list of windows */}
          <div className="flex flex-auto flex-col space-y-1">
            {/* First window - Input */}
            <div className="flex flex-1 flex-col">
              <div className="flex-1 text-sm font-bold">Input Editor</div>
              <Editor
                className="flex-1"
                defaultLanguage="json"
                defaultValue={defaultExample.input}
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
                onMount={(editor) => {
                  editorInputRef.current = editor;
                }}
              />
            </div>

            {/* Second window - Data */}
            <div className="flex flex-1 flex-col">
              <div className="flex-1 text-sm font-bold">Data Editor</div>
              <Editor
                className="flex-1"
                defaultLanguage="json"
                defaultValue={defaultExample.data}
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
                onMount={(editor) => {
                  editorDataRef.current = editor;
                }}
              />
            </div>

            {/* Third window - Output */}
            <div className="flex flex-1 flex-col">
              <div className="flex-1 text-sm font-bold">Output - {result}</div>
              <Editor
                className="flex-1"
                defaultLanguage="json"
                defaultValue="// Output goes here"
                options={{
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
      </div>
    </div>
  );
}

export default App;
