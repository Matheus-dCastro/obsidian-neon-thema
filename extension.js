const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

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

  // Terminal & Autocomplete
  "terminal.integrated.suggest.enabled": true,
  "terminal.integrated.suggest.insertTrailingSpace": true,
  "terminal.integrated.suggest.providers": {
    "lsp": true
  },
  "terminal.integrated.suggest.suggestOnTriggerCharacters": true,
  "terminal.integrated.suggest.quickSuggestions": true,
  "terminal.integrated.fontWeight": "normal",
  "terminal.integrated.cursorStyle": "line"
};

const HIGHLIGHT_SETTINGS = {
  // Highlight e Animações
  "editor.renderLineHighlight": "all",
  "editor.renderLineHighlightOnlyWhenFocus": false,
  "editor.cursorBlinking": "expand",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.bracketPairColorization.enabled": true,
  "editor.semanticHighlighting.enabled": true,
  "editor.letterSpacing": 0.5
};

const HIGHLIGHT_COLOR_CUSTOMIZATIONS = {
  "editor.lineHighlightBackground": "#8854F115",
  "editor.lineHighlightBorder": "#8854F133",
  "editor.selectionBackground": "#8888CC55",
  "editor.selectionHighlightBackground": "#8888CC33"
};

function isUbuntu() {
  if (process.platform !== 'linux') return false;
  try {
    const release = fs.readFileSync('/etc/os-release', 'utf8').toLowerCase();
    return release.includes('ubuntu');
  } catch {
    return true;
  }
}

function getPreferredFontFamily() {
  // Dá preferência pela NF se estiver no Ubuntu / Linux
  if (isUbuntu()) {
    return "'Maple Mono NF', 'Maple Mono', monospace";
  }
  return "'Maple Mono', 'Maple Mono NF', monospace";
}

async function installFonts(context) {
  const fontSourceDir = context.asAbsolutePath('Font');
  if (!fs.existsSync(fontSourceDir)) {
    return false;
  }

  const platform = process.platform;

  try {
    if (platform === 'win32') {
      const winFontsDir = path.join(
        process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
        'Microsoft',
        'Windows',
        'Fonts'
      );

      if (!fs.existsSync(winFontsDir)) {
        fs.mkdirSync(winFontsDir, { recursive: true });
      }

      const fontEntries = [
        { file: 'MapleMono[wght]-VF.ttf', name: 'Maple Mono Regular (TrueType)' },
        { file: 'MapleMono-Italic[wght]-VF.ttf', name: 'Maple Mono Italic (TrueType)' },
        { file: 'MapleMono-NF-Base.ttf', name: 'Maple Mono NF Base Regular (TrueType)' },
        { file: 'MapleMono-NF-Base-Mono.ttf', name: 'Maple Mono NF Base Mono Regular (TrueType)' },
        { file: 'MapleMono-NF-Base-Propo.ttf', name: 'Maple Mono NF Base Propo Regular (TrueType)' }
      ];

      for (const item of fontEntries) {
        const src = path.join(fontSourceDir, item.file);
        const dest = path.join(winFontsDir, item.file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          await new Promise((resolve) => {
            exec(`reg add "HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Fonts" /v "${item.name}" /t REG_SZ /d "${dest}" /f`, () => resolve());
          });
        }
      }
      return true;
    } else if (platform === 'linux') {
      const linuxFontsDir = path.join(os.homedir(), '.local', 'share', 'fonts', 'MapleMono');
      if (!fs.existsSync(linuxFontsDir)) {
        fs.mkdirSync(linuxFontsDir, { recursive: true });
      }

      const files = fs.readdirSync(fontSourceDir).filter(f => f.endsWith('.ttf'));
      for (const file of files) {
        fs.copyFileSync(path.join(fontSourceDir, file), path.join(linuxFontsDir, file));
      }

      await new Promise((resolve) => {
        exec('fc-cache -f', () => resolve());
      });
      return true;
    } else if (platform === 'darwin') {
      const macFontsDir = path.join(os.homedir(), 'Library', 'Fonts');
      if (!fs.existsSync(macFontsDir)) {
        fs.mkdirSync(macFontsDir, { recursive: true });
      }

      const files = fs.readdirSync(fontSourceDir).filter(f => f.endsWith('.ttf'));
      for (const file of files) {
        fs.copyFileSync(path.join(fontSourceDir, file), path.join(macFontsDir, file));
      }
      return true;
    }
  } catch (error) {
    console.error('Erro ao instalar fontes no sistema:', error);
    return false;
  }
  return false;
}

async function applyFontAndSettings(context, isManual = true) {
  const config = vscode.workspace.getConfiguration();

  // 1. Instalação das fontes no Sistema Operacional
  const fontInstalled = await installFonts(context);

  // 2. Família de fontes (com preferência NF se Ubuntu) e ligaduras
  const fontFamily = getPreferredFontFamily();
  const terminalFontFamily = "'Maple Mono NF', 'Maple Mono', monospace";

  await config.update('editor.fontFamily', fontFamily, vscode.ConfigurationTarget.Global);
  await config.update('terminal.integrated.fontFamily', terminalFontFamily, vscode.ConfigurationTarget.Global);
  await config.update('editor.fontLigatures', true, vscode.ConfigurationTarget.Global);

  // 3. Highlight ("higthline")
  for (const [key, value] of Object.entries(HIGHLIGHT_SETTINGS)) {
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  const existingColors = config.get('workbench.colorCustomizations') || {};
  const updatedColors = { ...existingColors, ...HIGHLIGHT_COLOR_CUSTOMIZATIONS };
  await config.update('workbench.colorCustomizations', updatedColors, vscode.ConfigurationTarget.Global);

  // 4. Autocomplete Terminal
  await config.update('terminal.integrated.suggest.enabled', true, vscode.ConfigurationTarget.Global);
  await config.update('terminal.integrated.suggest.insertTrailingSpace', true, vscode.ConfigurationTarget.Global);
  await config.update('terminal.integrated.suggest.providers', { lsp: true }, vscode.ConfigurationTarget.Global);
  await config.update('terminal.integrated.suggest.suggestOnTriggerCharacters', true, vscode.ConfigurationTarget.Global);
  await config.update('terminal.integrated.suggest.quickSuggestions', true, vscode.ConfigurationTarget.Global);
  await config.update('terminal.integrated.fontWeight', 'normal', vscode.ConfigurationTarget.Global);
  await config.update('terminal.integrated.cursorStyle', 'line', vscode.ConfigurationTarget.Global);

  if (isManual) {
    const primaryFont = fontFamily.split(',')[0].replace(/'/g, '');
    const msg = fontInstalled
      ? `✨ Fonte ${primaryFont} instalada no sistema e ativada! Highlight de linha, ligaduras e autocomplete do terminal configurados com sucesso.`
      : `✨ Fonte ${primaryFont} ativada no VS Code! Highlight de linha, ligaduras e autocomplete do terminal configurados com sucesso.`;
    vscode.window.showInformationMessage(msg);
  }
}

async function applyRecommendedSettings(context, isAuto = false) {
  const config = vscode.workspace.getConfiguration();

  for (const [key, value] of Object.entries(RECOMMENDED_SETTINGS)) {
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  // Aplica também a fonte, highlight, ligaduras e autocomplete do terminal
  await applyFontAndSettings(context, false);

  // Formatter do Python com escopo de linguagem
  const pythonEditorConfig = vscode.workspace.getConfiguration('editor', { languageId: 'python' });
  await pythonEditorConfig.update('defaultFormatter', 'ms-python.black-formatter', vscode.ConfigurationTarget.Global, true);

  if (!isAuto) {
    vscode.window.showInformationMessage("⚡ Configurações recomendadas do Obsidian Neon (Fonte Maple Mono, Ligaduras, Highlight, Terminal, Inlay Hints) foram aplicadas com sucesso!");
  }
}

async function activate(context) {
  // Registrar comandos na Command Palette (Ctrl+Shift+P)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'obsidianNeon.activateFontAndSettings',
      () => applyFontAndSettings(context, true)
    ),
    vscode.commands.registerCommand(
      'obsidianNeon.installFonts',
      async () => {
        await installFonts(context);
        await applyFontAndSettings(context, true);
      }
    ),
    vscode.commands.registerCommand(
      'obsidianNeon.applyRecommendedSettings',
      () => applyRecommendedSettings(context, false)
    )
  );

  // Ativação inicial após instalação
  const hasInitialized = context.globalState.get('obsidianNeonInitialized');
  if (!hasInitialized) {
    // Ativa os ícones automaticamente
    const config = vscode.workspace.getConfiguration();
    await config.update('workbench.iconTheme', 'material-icon-theme', vscode.ConfigurationTarget.Global);

    // Sugere ativar as configurações completas e fonte
    vscode.window.showInformationMessage(
      "🌌 Obsidian Neon instalado! Deseja ativar a fonte Maple Mono e as configurações recomendadas (Highlight, Terminal Autocomplete, Ligaduras, Inlay Hints)?",
      "Sim, Ativar Tudo",
      "Mais tarde"
    ).then(async (choice) => {
      if (choice === "Sim, Ativar Tudo") {
        await applyRecommendedSettings(context, false);
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
