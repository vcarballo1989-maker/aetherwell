@echo off
chcp 65001 >nul
title Antigravity - Conector Chrome TikTok Ads (Puerto 9222)
cls
echo ==============================================================================
echo        ANTIGRAVITY AUTONOMOUS ECOSYSTEM - CONECTOR TIKTOK ADS CHROME
echo ==============================================================================
echo.
echo Para que el agente autonomo pueda operar dentro del Dashboard de TikTok Ads:
echo 1. Se reiniciara Google Chrome con el puerto de depuracion activa (9222).
echo 2. Se restauraran tus pestanas y cuentas intactas (--restore-last-session).
echo 3. Se abrira directamente tu borrador de campana de TikTok Ads:
echo    ID de Anunciante: 7607711370196615636
echo    Borrador Activo:  1829324173694055
echo.
echo Presiona cualquier tecla para continuar (o cierra esta ventana para cancelar)...
pause >nul

echo.
echo [*] Cerrando Chrome para habilitar el puerto 9222...
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [*] Iniciando Google Chrome con depuracion remota...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --restore-last-session "https://ads.tiktok.com/i18n/creation/1/rs/create/campaign?aadvid=7607711370196615636&campaign_draft_id=1829324173694055"

echo [*] Verificando conexion en http://127.0.0.1:9222 ...
timeout /t 3 /nobreak >nul

powershell -Command "try { $v = Invoke-RestMethod -Uri 'http://127.0.0.1:9222/json/version' -TimeoutSec 3; Write-Host '>>> CONEXION EXITOSA CON CHROME: ' $v.Browser -ForegroundColor Green; Write-Host '>>> El agente ya puede operar en TikTok Ads.' -ForegroundColor Cyan } catch { Write-Host '>>> Esperando a que Chrome termine de abrir...' -ForegroundColor Yellow }"

echo.
echo ==============================================================================
echo ¡Listo! Ahora el agente puede controlar el editor de video de TikTok Ads.
echo Puedes minimizar esta ventana.
echo ==============================================================================
echo.
pause
