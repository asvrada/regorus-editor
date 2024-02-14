export default function Summary({ className }) {
  return (
    <div className={className + " container mx-auto"}>
      <div className="m-2">
        <div>Regorus is</div>
        <ul className="list-disc mx-4">
          <li>
            Rego-Rus(t) - A fast, light-weight Rego interpreter written in Rust.
          </li>
          <li>
            Rigorous - A rigorous enforcer of well-defined Rego semantics.
          </li>
        </ul>
      </div>
      <div className="m-2">
        <div>Regorus is also</div>
        <ul className="list-disc mx-4">
          <li>cross-platform - Written in platform-agnostic Rust.</li>
          <li>
            current - We strive to keep Regorus up to date with latest OPA
            release. Regorus supports `import rego.v1`
          </li>
          <li>
            compliant - Regorus is mostly compliant with the latest XXX. See XXX
            for details. Note that while we xxx
          </li>
          <li>polyglot - XXX</li>
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
