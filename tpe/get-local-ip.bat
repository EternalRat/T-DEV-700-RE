@echo off

rem Obtenir l'adresse IP locale
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr IPv4') do set IP=%%i

rem Générer le fichier .env
echo API_URL=%IP:~1%:8080 > .env

rem Afficher l'adresse IP locale
echo Adresse IP locale: %IP%