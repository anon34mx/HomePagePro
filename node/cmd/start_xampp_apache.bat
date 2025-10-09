@echo off
cd /D %~dp0

echo Apache 2 is stopping...

apache\bin\pv -f -k httpd.exe -q
if not exist apache\logs\httpd.pid GOTO exit
del apache\logs\httpd.pid

echo Apache 2 is re-starting ...

apache\bin\httpd.exe

if errorlevel 255 goto finish
if errorlevel 1 goto error
goto finish

:error
echo.
echo Apache konnte nicht gestartet werden
echo Apache could not be started
pause

:finish