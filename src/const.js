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
  symbols: /[=><!~?:&|+\-*/^%]+/,

  tokenizer: {
    root: [
      [
        /[a-zA-Z'_?\\][\w'?\\]*/,
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
      [/[{}()[\]]/, "@brackets"],
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
      [/[0-9_]*\.[0-9_]+([eE][-+]?\d+)?[fFdD]?/, "number.float"],
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

export { SEPARATOR, REGO_LANGUAGE };
