@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js 22.13 or later, then reopen this launcher.
  pause
  exit /b 1
)
call npm run demo
pause
