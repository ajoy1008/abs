@echo off
echo Creating ZIP file for ABC WORDS Chrome Extension...

REM Create a temporary directory for the extension
if exist "ABC-WORDS-Extension" rmdir /s /q "ABC-WORDS-Extension"
mkdir "ABC-WORDS-Extension"

REM Copy all extension files
copy "manifest.json" "ABC-WORDS-Extension\"
copy "background.js" "ABC-WORDS-Extension\"
copy "content.js" "ABC-WORDS-Extension\"
copy "popup.html" "ABC-WORDS-Extension\"
copy "styles.css" "ABC-WORDS-Extension\"
copy "uninstalled.html" "ABC-WORDS-Extension\"
copy "README.md" "ABC-WORDS-Extension\"
copy "LICENSE" "ABC-WORDS-Extension\"
copy ".gitignore" "ABC-WORDS-Extension\"

REM Create ZIP file using PowerShell
powershell -command "Compress-Archive -Path 'ABC-WORDS-Extension\*' -DestinationPath 'ABC-WORDS-Chrome-Extension-v1.0.zip' -Force"

REM Clean up temporary directory
rmdir /s /q "ABC-WORDS-Extension"

echo.
echo ZIP file created successfully: ABC-WORDS-Chrome-Extension-v1.0.zip
echo.
echo You can now:
echo 1. Upload this ZIP file to GitHub Releases
echo 2. Share it with others for easy installation
echo 3. Submit it to Chrome Web Store
echo.
pause 