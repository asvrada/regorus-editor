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

function App() {
  const [engine, setEngine] = useState(null);
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

  return (
    <>
      {/* Header for things like Evaluate/Format/Publish buttons */}
      <div>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            let policy = editorPolicyRef.current.getValue();
            let files = policy.split(SEPARATOR);

            try {
              var startTime = new Date();
              var engine = new Engine();
              for (var i = 0; i < files.length; ++i) {
                engine.add_policy("policy.rego", files[i]);
              }

              engine.set_input(editorInputRef.current.getValue());
              engine.add_data(editorDataRef.current.getValue());
              let parse_time = new Date() - startTime;

              let results = engine.eval_query("data");
              var elapsed = new Date() - startTime;
              let output = `// Evaluation took ${elapsed} milliseconds. parse = ${parse_time}, eval = ${elapsed - parse_time}\n${results}`;
              editorOutputRef.current.setValue(output);
            } catch (error) {
              editorOutputRef.current.setValue(error);
            }
          }}
        >
          Evaluate
        </button>
      </div>

      {/* Main Editor body */}
      <div className="container mx-auto">
        <div className="flex flex-row">
          {/* Left window - Rego policy data */}
          <div className="h-screen flex-auto">
            <Editor
              defaultLanguage="javascript"
              defaultValue="Rego policy goes here"
              onMount={(editor, monaco) => {
                editorPolicyRef.current = editor;
              }}
            />
          </div>

          {/* Right Column for a list of windows */}
          <div className="flex-auto">
            {/* First window - Input */}
            <div className="h-1/3">
              <Editor
                defaultLanguage="javascript"
                defaultValue="Input goes here"
                onMount={(editor, monaco) => {
                  editorInputRef.current = editor;
                }}
              />
            </div>

            {/* Second window - Data */}
            <div className="h-1/3">
              <Editor
                defaultLanguage="javascript"
                defaultValue="Data goes here"
                onMount={(editor, monaco) => {
                  editorDataRef.current = editor;
                }}
              />
            </div>

            {/* Third window - Output */}
            <div className="h-1/3">
              <Editor
                defaultLanguage="javascript"
                defaultValue="Output goes here"
                onMount={(editor, monaco) => {
                  editorOutputRef.current = editor;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
