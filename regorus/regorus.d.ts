/* tslint:disable */
/* eslint-disable */
/**
*/
export class Engine {
  free(): void;
/**
*/
  constructor();
/**
* @returns {Engine}
*/
  clone_engine(): Engine;
/**
* @param {string} path
* @param {string} rego
*/
  add_policy(path: string, rego: string): void;
/**
* @param {string} data
*/
  add_data(data: string): void;
/**
* @param {string} input
*/
  set_input(input: string): void;
/**
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
  readonly engine_clone_engine: (a: number) => number;
  readonly engine_add_policy: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly engine_add_data: (a: number, b: number, c: number, d: number) => void;
  readonly engine_set_input: (a: number, b: number, c: number, d: number) => void;
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
