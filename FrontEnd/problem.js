
// THEME TOGGLE
function initTheme() {
  const themeBtn = document.getElementById("theme-toggle");
  const body = document.body;

  // Apply saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    body.classList.add("light-theme");
  } else {
    body.classList.remove("light-theme");
  }

  // Update button icon/text to reflect opposite action (what clicking will do)
  function updateThemeBtn() {
    if (body.classList.contains("light-theme")) {
      // show moon to indicate switch to dark
      themeBtn.textContent = "🌙";
      themeBtn.title = "Switch to Dark";
    } else {
      // show sun to indicate switch to light
      themeBtn.textContent = "☀";
      themeBtn.title = "Switch to Light";
    }
  }

  updateThemeBtn();

  themeBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    if (body.classList.contains("light-theme")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
    updateThemeBtn();
  });
}

//ACE EDITOR SETUP
let editor;

function initEditor() {
  // initialize Ace editor
  editor = ace.edit("editor", {
    theme: "ace/theme/monokai",
    mode: "ace/mode/c_cpp",
    fontSize: 14,
    showPrintMargin: false,
    wrap: true
  });

  // starter templates
  const templates = {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello from C++!\\n";
    return 0;
}
`,
    python: `# Python 3\nprint("Hello from Python!")\n`,
    java: `// Java\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}\n`,
    js: `// JavaScript (Node)\nconsole.log("Hello from JavaScript!");\n`
  };

  // set initial code
  editor.setValue(templates.cpp, -1);

  // language selector
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", (e) => {
    const lang = e.target.value;
    if (lang === "cpp") editor.session.setMode("ace/mode/c_cpp");
    else if (lang === "python") editor.session.setMode("ace/mode/python");
    else if (lang === "java") editor.session.setMode("ace/mode/java");
    else if (lang === "js") editor.session.setMode("ace/mode/javascript");

    // replace content with template for demo (only if editor is empty or holds previous template)
    const current = editor.getValue().trim();
    if (current === "" || current.startsWith("#include") || current.startsWith("print(") || current.includes("Hello from")) {
      editor.setValue(templates[lang], -1);
    }
  });

  // Copy button
  document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(editor.getValue());
      alert("Code copied to clipboard");
    } catch (err) {
      alert("Copy failed");
    }
  });

  // Reset button
  document.getElementById("reset-btn").addEventListener("click", () => {
    const lang = document.getElementById("lang-select").value;
    editor.setValue(templates[lang], -1);
  });

  // Run button (frontend-only demo)
  document.getElementById("run-btn").addEventListener("click", simulateRun);
}

//SIMULATED RUN (FRONTEND DEMO) 
function simulateRun() {
  const outputEl = document.getElementById("output");
  const lang = document.getElementById("lang-select").value;
  const stdin = document.getElementById("stdin").value.trim();

  // UX feedback
  const runBtn = document.getElementById("run-btn");
  runBtn.disabled = true;
  runBtn.textContent = "Running...";

  setTimeout(() => {
    let result = "";
    if (lang === "cpp") result = "Hello from C++!";
    else if (lang === "python") result = "Hello from Python!";
    else if (lang === "java") result = "Hello from Java!";
    else result = "Hello from JavaScript!";

    if (stdin) {
      result += `\n\n--- stdin ---\n${stdin}`;
    }

    outputEl.textContent = result;
    runBtn.disabled = false;
    runBtn.textContent = "▶ Run";
  }, 900);
}

//TAG FILTER
function initTags() {
  document.querySelectorAll(".tag").forEach(tag => {
    tag.addEventListener("click", () => {
      document.querySelectorAll(".tag").forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      console.log("Selected Tag:", tag.textContent);
      // future: filter problems by tag
    });
  });
}

//BOOTSTRAP on DOM ready
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTags();

  // initialize Ace - it may be loaded already by CDN; ensure it's ready
  if (window.ace) {
    initEditor();
  } else {
    // wait a short time for ace script to load (rare cases)
    const id = setInterval(() => {
      if (window.ace) {
        clearInterval(id);
        initEditor();
      }
    }, 100);
  }
});
