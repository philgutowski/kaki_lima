@echo off

set CUR=%~1
dir /ad "%CUR%" >nul 2>nul&&goto Folder||goto File

:Folder
"node.exe" "%~dp0imagemin" "%CUR%"   
goto End 

:File
REM 判断文件类型
set FILE_TYPE=%~x1
for %%i in (.png .gif .jpg .jpeg) do (if "%FILE_TYPE%"=="%%i" goto Compress)

 
:Compress   
"node.exe" "%~dp0imagemin" "%~n1%~x1" -o  "%~n1_out%~x1"  
goto End 
 
 
:End
pause