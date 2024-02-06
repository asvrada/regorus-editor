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

  function onClickEvaluate() {
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
  }

  return (
    <>
      <div className="flex h-screen flex-col bg-slate-300">
        {/* Header for things like Evaluate/Format/Publish buttons */}
        <header className="my-2 flex flex-none flex-row-reverse">
          <button
            className="mr-8 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={onClickEvaluate}
          >
            Evaluate
          </button>
        </header>

        {/* Main Editor body */}
        <div className="flex-auto grow">
          <div className="flex h-full flex-row space-x-4">
            {/* Left window - Rego policy data */}
            <div className="flex-auto">
              <Editor
                defaultLanguage="Rego"
                defaultValue={`package test\nallow = false`}
                beforeMount={(monaco) => {
                  monaco.languages.register({ id: "Rego" });
                  monaco.languages.setMonarchTokensProvider(
                    "Rego",
                    REGO_LANGUAGE,
                  );
                }}
                onMount={(editor, monaco) => {
                  editorPolicyRef.current = editor;
                }}
              />
            </div>

            {/* Right Column for a list of windows */}
            <div className="flex flex-auto flex-col space-y-4">
              {/* First window - Input */}
              <div className="flex flex-1 flex-col">
                <div className="h-8 flex-1">Input Editor</div>
                <Editor
                  className="flex-1"
                  defaultLanguage="json"
                  defaultValue="{}"
                  onMount={(editor, monaco) => {
                    editorInputRef.current = editor;
                  }}
                />
              </div>

              {/* Second window - Data */}
              <div className="flex flex-1 flex-col">
              <div className="h-8 flex-1">Data Editor</div>
                <Editor
                  className="flex-1"
                  defaultLanguage="json"
                  defaultValue="{}"
                  onMount={(editor, monaco) => {
                    editorDataRef.current = editor;
                  }}
                />
              </div>

              {/* Third window - Output */}
              <div className="flex flex-1 flex-col">
              <div className="h-8 flex-1">Output</div>
                <Editor
                  className="flex-1"
                  defaultLanguage="json"
                  defaultValue="// Output goes here"
                  onMount={(editor, monaco) => {
                    editorOutputRef.current = editor;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
