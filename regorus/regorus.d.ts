/* tslint:disable */
/* eslint-disable */
/**
* WASM wrapper for [`regorus::Engine`]
*/
export class Engine {
  free(): void;
/**
* Construct a new Engine
*
* See https://docs.rs/regorus/latest/regorus/struct.Engine.html
*/
  constructor();
/**
* Add a policy
*
* The policy is parsed into AST.
* See https://docs.rs/regorus/latest/regorus/struct.Engine.html#method.add_policy
*
* * `path`: A filename to be associated with the policy.
* * `rego`: Rego policy.
* @param {string} path
* @param {string} rego
*/
  add_policy(path: string, rego: string): void;
/**
* Add policy data.
*
* See https://docs.rs/regorus/latest/regorus/struct.Engine.html#method.add_data
* * `data`: JSON encoded value to be used as policy data.
* @param {string} data
*/
  add_data_json(data: string): void;
/**
* Clear policy data.
*
* See https://docs.rs/regorus/0.1.0-alpha.2/regorus/struct.Engine.html#method.clear_data
*/
  clear_data(): void;
/**
* Set input.
*
* See https://docs.rs/regorus/0.1.0-alpha.2/regorus/struct.Engine.html#method.set_input
* * `input`: JSON encoded value to be used as input to query.
* @param {string} input
*/
  set_input_json(input: string): void;
/**
* Evaluate query.
*
* See https://docs.rs/regorus/0.1.0-alpha.2/regorus/struct.Engine.html#method.eval_query
* * `query`: Rego expression to be evaluate.
* @param {string} query
* @returns {string}
*/
  eval_query(query: string): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_engine_free: (a: number) => void;
  readonly engine_new: () => number;
  readonly engine_add_policy: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly engine_add_data_json: (a: number, b: number, c: number, d: number) => void;
  readonly engine_clear_data: (a: number, b: number) => void;
  readonly engine_set_input_json: (a: number, b: number, c: number, d: number) => void;
  readonly engine_eval_query: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
