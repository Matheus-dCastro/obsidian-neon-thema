const vscode = require('vscode');

const RECOMMENDED_SETTINGS = {
  // Global
  "editor.inlayHints.enabled": "on",
  "workbench.iconTheme": "material-icon-theme",
  "chat.viewSessions.orientation": "stacked",

  // Python
  "python.analysis.inlayHints.functionReturnTypes": true,
  "python.analysis.inlayHints.variableTypes": true,
  "python.analysis.inlayHints.callArgumentNames": "all",
  "python.analysis.inlayHints.pytestParameters": true,
  "python.analysis.showOnlyDirectDependenciesInAutoImport": true,
  "python.analysis.autoImportCompletions": true,

  // Java
  "java.inlayHints.variableTypes.enabled": true,
  "java.inlayHints.methodReturnTypes.enabled": true,
  "java.inlayHints.parameterNames.enabled": "all",

  // C / C++
  "C_Cpp.inlayHints.parameterNames.enabled": true,
  "C_Cpp.inlayHints.parameterNames.hideLeadingUnderscores": false,
  "C_Cpp.inlayHints.referenceOperator": true,
  "C_Cpp.inlayHints.autoDeclarationTypes.enabled": true,

  // Kotlin
  "kotlin.inlayHints.typeHints": true,
  "kotlin.inlayHints.parameterHints": true,
  "kotlin.inlayHints.chainedHints": true,

  // JavaScript
  "javascript.inlayHints.variableTypes.enabled": true,
  "javascript.inlayHints.functionLikeReturnTypes.enabled": true,
  "javascript.inlayHints.parameterNames.enabled": "all",
  "javascript.inlayHints.parameterTypes.enabled": true,
  "javascript.inlayHints.propertyDeclarationTypes.enabled": true,
  "javascript.inlayHints.enumMemberValues.enabled": true,

  // TypeScript
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true,
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.parameterTypes.enabled": true,
  "typescript.inlayHints.propertyDeclarationTypes.enabled": true,
  "typescript.inlayHints.enumMemberValues.enabled": true,

  // C# / .NET
  "csharp.inlayHints.enableInlayHintsForImplicitObjectCreation": true,
  "csharp.inlayHints.enableInlayHintsForImplicitVariableTypes": true,
  "csharp.inlayHints.enableInlayHintsForLambdaParameterTypes": true,
  "csharp.inlayHints.enableInlayHintsForTypes": true,
  "dotnet.inlayHints.enableInlayHintsForParameters": true,
  "dotnet.inlayHints.enableInlayHintsForIndexerParameters": true,
  "dotnet.inlayHints.enableInlayHintsForLiteralParameters": true,
  "dotnet.inlayHints.enableInlayHintsForObjectCreationParameters": true,
  "dotnet.inlayHints.enableInlayHintsForOtherParameters": true,

  // Terminal
  "terminal.integrated.suggest.enabled": true,
  "terminal.integrated.suggest.insertTrailingSpace": true,
  "terminal.integrated.suggest.providers": {
    "lsp": true
  },
  "terminal.integrated.suggest.suggestOnTriggerCharacters": true,
  "terminal.integrated.suggest.quickSuggestions": true
};

async function applyRecommendedSettings(isAuto = false) {
  const config = vscode.workspace.getConfiguration();

  for (const [key, value] of Object.entries(RECOMMENDED_SETTINGS)) {
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  // Formatter do Python com escopo de linguagem
  const pythonEditorConfig = vscode.workspace.getConfiguration('editor', { languageId: 'python' });
  await pythonEditorConfig.update('defaultFormatter', 'ms-python.black-formatter', vscode.ConfigurationTarget.Global, true);

  if (!isAuto) {
    vscode.window.showInformationMessage("⚡ Configurações recomendadas do Obsidian Neon (Inlay Hints, Terminal, Ícones) foram aplicadas com sucesso!");
  }
}

async function activate(context) {
  // Registrar comando na Command Palette
  const disposable = vscode.commands.registerCommand(
    'obsidianNeon.applyRecommendedSettings',
    () => applyRecommendedSettings(false)
  );
  context.subscriptions.push(disposable);

  // Ativação inicial após instalação
  const hasInitialized = context.globalState.get('obsidianNeonInitialized');
  if (!hasInitialized) {
    // Ativa os ícones automaticamente
    const config = vscode.workspace.getConfiguration();
    await config.update('workbench.iconTheme', 'material-icon-theme', vscode.ConfigurationTarget.Global);

    // Sugere ativar as configurações completas
    vscode.window.showInformationMessage(
      "🌌 Obsidian Neon instalado! Deseja ativar as configurações recomendadas (Inlay Hints, Terminal, Formatação)?",
      "Sim, Ativar",
      "Mais tarde"
    ).then(async (choice) => {
      if (choice === "Sim, Ativar") {
        await applyRecommendedSettings(false);
      }
    });

    await context.globalState.update('obsidianNeonInitialized', true);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
