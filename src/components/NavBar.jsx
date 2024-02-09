import GithubMark from "../assets/github-mark.svg?react";

export default function NavBar({ callbackLoadExample, callbackEvaluate }) {
  return (
    <nav>
      <div className="mx-auto flex flex-wrap items-center justify-between px-4 py-2">
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Regorus Playground
        </span>
        <div className="flex space-x-3">
          <button
            type="button"
            className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            onClick={callbackLoadExample}
          >
            Load Example
          </button>

          <button
            type="button"
            className="me-2 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={callbackEvaluate}
          >
            Evaluate
          </button>

          <a
            href="https://github.com/microsoft/regorus"
            target="_blank"
            rel="noreferrer"
            type="button"
            className="me-2 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            <GithubMark className="me-2 h-5 w-5" viewBox="0 0 96 96" />
            Check on GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
