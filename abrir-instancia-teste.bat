@echo off
echo =======================================================
echo Iniciando VS Code Isolado com Obsidian Neon v1.4.0
echo =======================================================
code --user-data-dir "%~dp0.test-instance\user-data" --extensions-dir "%~dp0.test-instance\extensions" "%~dp0samples\preview.py"
