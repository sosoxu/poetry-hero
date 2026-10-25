@echo off
chcp 65001 >nul
title 背诗小状元 - 打包APK
cd /d "%~dp0"

set JAVA_HOME=D:\mywsl\tools\jdk21
set ANDROID_HOME=D:\mywsl\tools\android-sdk
set PATH=%JAVA_HOME%\bin;%PATH%

echo [1/4] 构建网页应用...
call npm run build || (echo [错误] 网页构建失败 & pause & exit /b 1)
node scripts\gen-sw.mjs || echo [警告] SW生成失败

echo [2/4] 同步到安卓项目...
call npx cap sync android || (echo [错误] 同步失败 & pause & exit /b 1)

echo [3/4] 编译APK...
cd android
call gradlew assembleDebug --no-daemon || (echo [错误] APK编译失败 & pause & exit /b 1)
cd ..

echo [4/4] 复制APK...
copy /Y android\app\build\outputs\apk\debug\app-debug.apk "..\背诗小状元.apk" >nul

echo.
echo ✅ 打包完成: %~dp0..\背诗小状元.apk
echo    传到手机上点击安装即可（需允许安装未知来源应用）
pause
