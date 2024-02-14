export default function Summary({ className }) {
  const styleLink = "underline text-blue-600 hover:text-blue-800 visited:text-purple-600";
  return (
    <div className={className + " container mx-auto"}>
      <div className="m-2">
        <div>Regorus is</div>
        <ul className="list-disc mx-4">
          <li>
            <span className="italic">Rego-Rus(t)</span> - A fast, light-weight <a className={styleLink} href="https://www.openpolicyagent.org/docs/latest/policy-language/">Rego</a> interpreter written in Rust.
          </li>
          <li>
            <span className="italic">Rigorous</span> - A rigorous enforcer of well-defined Rego semantics.
          </li>
        </ul>
      </div>
      <div className="m-2">
        <div>Regorus is also</div>
        <ul className="list-disc mx-4">
          <li><span className="italic">cross-platform</span> - Written in platform-agnostic Rust.</li>
          <li>
            <span className="italic">current</span> - We strive to keep Regorus up to date with latest OPA
            release. Regorus supports `import rego.v1`
          </li>
          <li>
          <span className="italic">compliant</span> - Regorus is mostly compliant with the latest <a className={styleLink} href="https://github.com/open-policy-agent/opa/releases/tag/v0.61.0">OPA release v0.61.0</a>. See <a className={styleLink} href="https://github.com/microsoft/regorus#opa-conformance">OPA Conformance</a>
            for details. Note that while we behaviorally produce the same results, we don't yet support all the builtins.
          </li>
          <li><span className="italic">extensible</span> - Extend the Rego language by implementing custom stateful builtins in Rust. See <a className={styleLink} href="https://github.com/microsoft/regorus/blob/fc68bf9c8bea36427dae9401a7d1f6ada771f7ab/src/engine.rs#L352">add extension</a>. Support for extensibility using other languages coming soon</li>
          <li><span className="italic">polyglot</span> - In addition to Rust, Regorus can be used from C, C++, C#, Golang, Javascript and Python. This is made possible by the excellent FFI tools available in the Rust ecosystem. See <a className={styleLink} href="https://github.com/microsoft/regorus#bindings">binding</a> for information on how to use Regorus from different languages.</li>
        </ul>
      </div>

      <div>
        Below editors are provided for you to try out a Javascript(WASM)
        compiled version of Regorus.
      </div>
      <div>
        Regorus is available as a library that can be easily integrated into
        your Rust projects.
      </div>
    </div>
  );
}
