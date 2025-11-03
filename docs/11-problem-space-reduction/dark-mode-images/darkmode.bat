@echo off
REM Make sure you are in the folder with your PNGs before running
REM Or specify full path to the folder

REM Create a folder for dark mode images
if not exist dark mkdir dark

REM Loop over all PNG files in the current folder
for %%f in (*.png) do (
    magick "%%f" -negate -brightness-contrast -10x15 "dark/%%~nf-dark.png"
)

echo Done! Dark mode images are in the "dark" folder.
pause
