# 🌌 Obsidian Neon

> A dark, high-contrast theme fusing Omni's deep obsidian interface with vibrant Dracula neon syntax highlights.

---

## 🎨 Themes Included

Obsidian Neon comes with **3 theme variants**:

1. **Obsidian Neon (Default)** — Omni-inspired deep obsidian canvas (`#191525`) combined with ultra-crisp neon syntax.
2. **Obsidian Neon (Dracula)** — Dracula-infused dark aesthetics with high-contrast neon accents and signature purple glow.
3. **Obsidian Neon (Dracula Syntax)** — Merges the deep obsidian workbench and icons of Obsidian Neon Default with the vibrant syntax/font colors of Dracula.

---

## ✨ Key Highlights

- **Ghost Letters & Italic Accents:** Elegant cursive/italic styling for comments, keywords, control flow, and storage modifiers.
- **Electric Neon Syntax:** Vivid function definitions in neon green (`#50FA7B`), keywords in hot pink (`#FF79C6`), numbers in violet (`#BD93F9`), and strings in soft yellow (`#F1FA8C`).
- **Semantic Highlighting Enabled:** Full support for modern semantic tokens across TypeScript, JavaScript, Python, C#, Rust, Go, and more.
- **Deep Obsidian Workbench:** Omni-inspired UI with custom borders, glowing cursors (`#9d54f1`), and clean tab separation.

---

## 📸 Preview

![Obsidian Neon Github](https://github.com/Matheus-dCastro/obsidian-neon-thema.git)

---

## 🚀 Installation

1. Open **VS Code**.
2. Press `Ctrl + P` (or `Cmd + P` on macOS).
3. Type:

   ```text
   ext install Alomyr.obsidian-neon
   ```

4. Choose your preferred variant: **Obsidian Neon**, **Obsidian Neon (Dracula)**, or **Obsidian Neon (Dracula Syntax)** via `Ctrl + K, Ctrl + T`.

---

## ⚙️ Recommended Settings

For the ultimate visual experience (with ligatures, smooth caret animations, and full font highlights):
Press `Ctrl + shift + P` and paste the json

```json
{
  "editor.fontFamily": "'Fira Code', 'Droid Sans Mono', monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 15,
  "editor.letterSpacing": 0.5,
  "editor.cursorBlinking": "expand",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.semanticHighlighting.enabled": true,
  "editor.bracketPairColorization.enabled": true,


  // ==================== GLOBAL ====================
  "editor.inlayHints.enabled": "on",

  // ==================== PYTHON ====================
  "python.analysis.inlayHints.functionReturnTypes": true,
  "python.analysis.inlayHints.variableTypes": true,
  "python.analysis.inlayHints.callArgumentNames": "all",
  "python.analysis.inlayHints.pytestParameters": true,
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "python.analysis.showOnlyDirectDependenciesInAutoImport": true,
  "python.analysis.autoImportCompletions": true,
  "chat.viewSessions.orientation": "stacked",
  // ==================== JAVA ====================
  "java.inlayHints.variableTypes.enabled": true,
  "java.inlayHints.methodReturnTypes.enabled": true,
  "java.inlayHints.parameterNames.enabled": "all",

  // ==================== C / C++ ====================
  "C_Cpp.inlayHints.parameterNames.enabled": true,
  "C_Cpp.inlayHints.parameterNames.hideLeadingUnderscores": false,
  "C_Cpp.inlayHints.referenceOperator": true,
  "C_Cpp.inlayHints.autoDeclarationTypes.enabled": true,
  // ==================== KOTLIN ====================
  "kotlin.inlayHints.typeHints": true,
  "kotlin.inlayHints.parameterHints": true,
  "kotlin.inlayHints.chainedHints": true,
  // ==================== JAVASCRIPT ====================
  "javascript.inlayHints.variableTypes.enabled": true,
  "javascript.inlayHints.functionLikeReturnTypes.enabled": true,
  "javascript.inlayHints.parameterNames.enabled": "all",
  "javascript.inlayHints.parameterTypes.enabled": true,
  "javascript.inlayHints.propertyDeclarationTypes.enabled": true,
  "javascript.inlayHints.enumMemberValues.enabled": true,

  // ==================== TYPESCRIPT ====================
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true,
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.parameterTypes.enabled": true,
  "typescript.inlayHints.propertyDeclarationTypes.enabled": true,
  "typescript.inlayHints.enumMemberValues.enabled": true,
  "csharp.inlayHints.enableInlayHintsForImplicitObjectCreation": true,
  // ==================== CSHARP ====================

  "csharp.inlayHints.enableInlayHintsForImplicitVariableTypes": true,
  "csharp.inlayHints.enableInlayHintsForLambdaParameterTypes": true,
  "csharp.inlayHints.enableInlayHintsForTypes": true,
  "dotnet.inlayHints.enableInlayHintsForParameters": true,
  "dotnet.inlayHints.enableInlayHintsForIndexerParameters": true,
  "dotnet.inlayHints.enableInlayHintsForLiteralParameters": true,
  "dotnet.inlayHints.enableInlayHintsForObjectCreationParameters": true,
  "dotnet.inlayHints.enableInlayHintsForOtherParameters": true,

  "terminal.integrated.suggest.enabled": true,
  "terminal.integrated.suggest.insertTrailingSpace": true,
  "terminal.integrated.suggest.providers": {
    "lsp": true
  },
  "terminal.integrated.suggest.suggestOnTriggerCharacters": true,
  "terminal.integrated.suggest.quickSuggestions": true

}
```
