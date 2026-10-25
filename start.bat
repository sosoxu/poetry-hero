@echo off
chcp 65001 >nul
title 背诗小状元
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装：https://nodejs.org/
  pause
  exit /b 1
)

if not exist dist (
  echo 首次运行，正在构建应用，请稍候...
  call npm install || (echo [错误] 依赖安装失败 & pause & exit /b 1)
  call npm run build || (echo [错误] 构建失败 & pause & exit /b 1)
  node scripts/gen-sw.mjs || echo [警告] 离线缓存生成失败，不影响在线使用
)

echo.
node server.mjs dist 4173
pause
