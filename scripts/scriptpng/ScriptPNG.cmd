:engine_25032016
@echo off
setlocal enabledelayedexpansion
:user_settings
set "autorun=0"
set "autorun_option=0"
set "auto_close=0"
set "number_of_thread=0"
:script_checks
set "check_script_running=1"
set "check_script_files=1"
:script_display
set "display_seperators=0"
set "display_size_out=0"
:script
set "name=ScriptPNG"
set "version=28.05.2016"
if "%~1" equ "thread" call:thread_work %4 %5 "%~2" "%~3" & exit /b
if "%~1" equ "" call:how_to & exit /b
title %name% - %version%
color 0f
:script_configuration
set "script_name=%~0"
set "path_source=%~dp0"
set "script_config=%path_source%lib\"
set "path_scripts=%path_source%lib\"
set "temp_path=%temp%\%name%\"
set "script_lock=%temp%\script.lock"
set "check_file=%path_source%\%name%"
call:set_separation
:script_check_run
if %check_script_running% equ 0 goto :script_lib_path
set "already_run="
call:already_run "%name% - %version%"
if defined already_run (
exit
)
set "check_file=%check_file%%already_run%"
if not defined already_run if exist "%temp_path%" 1>nul 2>&1 rd /s /q "%temp_path%"
:script_lib_path
set "lib=%~dp0lib\"
path %lib%;%path%
:script_check_files
set "no_file="
if not exist %lib% set "no_file=1"
if %check_script_files% equ 0 goto :temp_path_random
if not exist %lib%ect.exe set "no_file=1"
if not exist %lib%deflopt.exe set "no_file=1"
if not exist %lib%pngquant.exe set "no_file=1"
if not exist %lib%truepng.exe set "no_file=1"
if not exist %lib%filter-png.js set "no_file=1"
:check_file_failed
if defined no_file (
cls
title %name% - Error
if exist "%temp_path%" 1>nul 2>&1 rd /s /q "%temp_path%"
1>&2 echo.
1>&2 echo.
1>&2 echo. %name% can not find lib folder or files.
1>&2 echo.
1>&2 echo.
1>nul 2>&1 pause
exit /b
)
:temp_path_random
set "random_number=%random%"
set "temp_path_random=%temp_path%%random_number%"
1>nul 2>&1 md "%temp_path_random%"
:script_counters
for %%a in (PNG) do (
set "image_number%%a=0"
set "total_number%%a=0"
set "total_size%%a=0"
set "image_size%%a=0"
set "change_size%%a=0"
set "change_purcent%%a=0"
)
:script_parameters
set "png="
set "start_time="
set "finish_time="
set "log_file=%temp_path%\files"
set "png_counters=%temp_path%\png_number"
set "file_list=%temp_path%\file_list"
:set_thread
set "thread=%NUMBER_OF_PROCESSORS%"
if %thread% lss 4 set "thread=1"
if %number_of_thread% neq 0 if %number_of_thread% neq 1 if %number_of_thread% neq 2 if %number_of_thread% neq 3 if %number_of_thread% neq 4 if %number_of_thread% neq 5 if %number_of_thread% neq 6 if %number_of_thread% neq 7 if %number_of_thread% neq 8 set "number_of_thread=0" & goto :set_thread
if %number_of_thread% gtr 8 set "number_of_thread=8"
if %number_of_thread% neq 0 set "thread=%number_of_thread%"
:check_png_files
if "%png%" equ "0" goto:no_images_found
:jscript_parser
cscript //nologo //e:jscript "%path_scripts%filter-png.js" /png:1 %* 1>"%file_list%"
:set_counters
if exist "%file_list%" (
if "%png%" neq "0" for /f "tokens=*" %%a in ('findstr /i /e ".png"  "%file_list%" ^| find /i /c ".png" 2^>nul') do set /a "total_numberPNG+=%%a"
)
if %total_numberPNG% gtr 0 (if not defined png call:png) else set "png=0"
:no_images_found
if %total_numberPNG% equ 0 (
title %name% - Error
cls
1>&2 echo.
1>&2 echo.
1>&2 echo. %name% can not find images.
1>&2 echo.
1>&2 echo.
1>nul 2>&1 pause
exit /b
)
for /l %%a in (1,1,%thread%) do (
>"%log_file%png.%%a" echo.
)
:first_echo
title %name% - %version%
if %png% equ 1 set "user_option=Fast"
if %png% equ 2 set "user_option=Intense"
if %png% equ 3 set "user_option=High"
if %png% equ 8 set "user_option=PNG-8"
if %png% equ 9 set "user_option=Lossy"
cls
call:echo_script %separation%
if %number_of_thread% equ 0 1>&2 echo. %name% - %version% - %user_option%
if %number_of_thread% neq 0 1>&2 echo. %name% - %version% - %user_option% (x%thread%)
call:echo_script %separation%
1>&2 echo.
:set_title-time
call:set_title
call:set_time start_time
for /f "usebackq tokens=1,2 delims=	" %%a in ("%file_list%") do (
call:file_work "%%~fa" "%%~fb" png %thread% image_numberPNG
)
:thread_wait
call:wait_flag "%temp_path%\thread*.lock"
for /l %%z in (1,1,%thread%) do (
call:type_log png %%z
)
call:set_title
call:finish_operations
1>nul 2>&1 pause
exit /b
:check_if_running
call:already_run "%~1"
if defined already_run (
exit
)
exit /b
:already_run
set "already_run="
for /f "tokens=* delims=" %%a in ('tasklist /fo csv /v /nh ^| find /i /c "%~1" ') do (
if %%a gtr 1 set "already_run=%%a"
)
exit /b
:set_time
set "%1=%time:~0,2%:%time:~3,2%:%time:~6,2%"
exit /b
:create_thread
if %2 equ 1 call:thread_work %1 1 %3 %4 & call:type_log %1 1 & exit /b
for /l %%z in (1,1,%2) do (
if not exist "%temp_path%\thread%%z.lock" (
call:type_log %1 %%z
>"%temp_path%\thread%%z.lock" echo. Processing: %3
start /b /low /min cmd.exe /s /c ""%script_name%" thread "%~3" "%~4" %1 %%z"
exit /b
)
)
1>nul 2>&1 ping -n 1 -w 1 127.0.0.1
goto:create_thread
:type_log
if %thread% equ 1 exit /b
if not defined type_number%1%2 set "type_number%1%2=1"
call:type_log_file "%log_file%%1.%2" "type_number%1%2" %%type_number%1%2%% %1
exit /b
:type_log_file
if not exist "%~1" exit /b
for /f "usebackq skip=%3 tokens=1-5 delims=;" %%b in ("%~1") do call:echo_file_info "%%~b" %%c %%d %%e %%f & set /a "%~2+=1"
exit /b
:echo_file_info
if "%~4" neq "0" (
if %display_size_out% equ 1 call:echo_script " (%5%%%%%%) - %~nx1 (%4) "
if %display_size_out% neq 1 call:echo_script " (%5%%%%%%) - %~nx1"
if %display_seperators% equ 1 call:echo_script %separation%
) else (
call:echo_script " (%5%%%%%%) - %~nx1"
if %display_seperators% equ 1 call:echo_script %separation%
)
exit /b
:echo_script
1>&2 echo.%~1
exit /b
:thread_work
1>nul 2>&1 md "%~dp4"
if /i "%1" equ "png" call:pngfile_work %2 %3 %4 & if %thread% gtr 1 >>"%png_counters%.%2" echo.1
if exist "%temp_path%\thread%2.lock" >nul 2>&1 del /f /q "%temp_path%\thread%2.lock"
exit /b
:wait_flag
if not exist "%~1" exit /b
1>nul 2>&1 ping -n 1 -w 1 127.0.0.1
goto:wait_flag
:png
if %autorun_option% neq 1 if %autorun_option% neq 2 if %autorun_option% neq 3 if %autorun_option% neq 8 if %autorun_option% neq 9 set "autorun_option=1"
if %autorun% equ 1 set "png=%autorun_option%" & exit /b
cls
set "png="
title %name% - %version%
1>&2 echo.
1>&2 echo.
1>&2 echo.
1>&2 echo. 
1>&2 echo.   Lossless for Web :
1>&2 echo.   ----------------
1>&2 echo.
1>&2 echo.   [1] Fast        [2] Intense      [3] High
1>&2 echo.
1>&2 echo.
1>&2 echo.   Lossy conversion :
1>&2 echo.   ----------------
1>&2 echo.
1>&2 echo.   [8] PNG8+A      [9] PNG24+A
1>&2 echo.
1>&2 echo.
1>&2 echo.
1>&2 echo.
set /p png="--> Choose an option : "
1>&2 echo.
if "%png%" neq "1" if "%png%" neq "2" if "%png%" neq "3" if "%png%" neq "8"  if "%png%" neq "9" goto:png
exit /b
:set_title
if "%png%" equ "0" (title %~1%name% - %version% & exit /b)
if %thread% gtr 1 (
set "image_numberPNG=0"
for /l %%c in (1,1,%thread%) do  (
for %%b in ("%png_counters%.%%c") do set /a "image_numberPNG+=%%~zb/3" 2>nul
)
)
set "title_progression="
set /a "change_purcent=%image_numberPNG%*100/%total_numberPNG%"
set "title_progression=!change_purcent!%%"
title %title_progression% - %name% - %version%
exit /b
:file_work
call:create_thread %3 %4 "%~f1" "%~f2"
set /a "%5+=1"
call:set_title
exit /b
:pngfile_work
set "pngoptimized_size=%~z2"
set "log_file2=%log_file%png.%1"
set "png_log=%temp_path%\png%1.log"
set "file_work=%temp_path%%~n2-script%1%~x2"
if %png% equ 1 (
1>nul 2>&1 ect "%~2"
)
if %png% equ 2 (
1>nul 2>&1 ect -s2 "%~2"
)
if %png% equ 3 (
1>nul 2>&1 ect -s3 "%~2"
)
if %png% equ 8 (
1>nul 2>&1 pngquant --speed 1 256 "%~2" -f -o "%file_work%"
call :check_compare "%~2" "%file_work%"
)
if %png% equ 9 (
1>nul 2>&1 truepng -nc -quiet -y -a9 -i0 -g0 -zc7 -zm9 -zs1 -zw7 -md remove all -l "%~2"
)
:pngfile_end
1>nul 2>&1 deflopt -k -b "%~2"
call:save_log "%~f3" %pngoptimized_size%
if %thread% equ 1 for %%a in ("%~f3") do (set /a "image_sizePNG+=%%~za" & set /a "total_sizePNG+=%pngoptimized_size%")
:png_clean
1>nul 2>&1 del /f /q "%file_work%" "%png_log%"
exit /b
:check_move
1>nul 2>&1 del /f /q %1
1>nul 2>&1 move /y %2 %1
exit /b
:check_compare
if %~z2 leq %~z1 (
1>nul 2>&1 del /f /q %1
1>nul 2>&1 move /y %2 %1
)
exit /b
:save_log
set "change_100=0"
set /a "change_size=%~z1-%2"
if %~z1 neq %2 set "change_100=1"
set /a "change_purcent=%change_size%*100/%2" 2>nul
set /a "change_purcent=100+%change_purcent%"
if %change_purcent% equ 100 if %change_100% equ 1 set "change_purcent=99"
>>"%log_file2%" echo.%~1;%2;%~z1;%change_size%;%change_purcent%;ok
if %thread% equ 1 (
call:echo_file_info "%~1" %2 %~z1 %change_size% %change_purcent%
)
exit /b
:finish_operations
title %name% - %version%
if %auto_close% equ 1 exit
call:set_time finish_time
set "change_sizePNG=0" & set "change_purcentPNG=0"
if %png% equ 0 1>nul 2>&1 ping -n 1 -w 1 127.0.0.1 & goto:end_processing
if %thread% gtr 1 (
for /f "tokens=1-5 delims=;" %%a in ('findstr /e /i /r /c:";ok" "%log_file%png*" ') do (
set /a "total_sizePNG+=%%b" & set /a "image_sizePNG+=%%c"
)
)
set /a "change_sizePNG=(%total_sizePNG%-%image_sizePNG%)" 2>nul
set /a "change_purcentPNG=%change_sizePNG%*100/%total_sizePNG%" 2>nul
set /a "change_sizePNG=(%change_sizePNG%/1024)" 2>nul
if %change_sizePNG% neq 0 if %change_purcentPNG% equ 0 set "change_purcentPNG=1"
:time_process
set "time_hours=0"
set "time_mins=0"
set "time_secs=0"
set "time_ms=0"
set time_get="tokens=1-4 delims=:."
for /f %time_get% %%a in ("%start_time%") do set start_h=%%a&set /a start_m=100%%b %% 100&set /a start_s=100%%c %% 100&set /a start_ms=100%%d %% 100
for /f %time_get% %%a in ("%finish_time%") do set finish_h=%%a&set /a finish_m=100%%b %% 100&set /a finish_s=100%%c %% 100&set /a finish_ms=100%%d %% 100
set /a "time_hours=%finish_h%-%start_h%"
set /a "time_mins=%finish_m%-%start_m%"
set /a "time_secs=%finish_s%-%start_s%"
set /a "time_ms=%finish_ms%-%start_ms%"
if %time_hours% lss 0 set /a "time_hours=24%time_hours%"
if %time_mins% lss 0 set /a "time_hours=%time_hours%-1" & set /a "time_mins=60%time_mins%"
if %time_secs% lss 0 set /a "time_mins=%time_mins%-1" & set /a "time_secs=60%time_secs%"
if %time_ms% lss 0 set /a "time_secs=%time_secs%-1" & set /a "time_ms=100%time_ms%"
if 1%time_ms% lss 100 set "time_ms=0%time_ms%"
set /a "total_seconds=%time_hours%*3600+%time_mins%*60+%time_secs%"
set "echo_seconds=seconds"
set "echo_minutes=minutes"
if %time_secs% equ 0 set "time_secs=1"
if %total_seconds% lss 2 set "echo_seconds=second"
if %time_mins% lss 2 set "echo_minutes=minute"
:show_results
if "%total_all%" neq "0" (
1>&2 echo.
call:echo_script %separation%
if %time_mins% equ 0 call:echo_script " (%%change_purcentPNG%%%%%%) - %change_sizePNG% KB saved in : %time_secs% %echo_seconds%"
if %time_mins% neq 0 call:echo_script " (%%change_purcentPNG%%%%%%) - %change_sizePNG% KB saved in : %time_mins% %echo_minutes% and %time_secs% %echo_seconds%"
call:echo_script %separation%
1>&2 echo.
)
:delete_temp
1>nul 2>&1 rd /q "%temp_path_random%"
call:cleaning
exit /b
:cleaning
if exist "%temp%\%name%\" (
1>nul 2>&1 del /f /q "%temp%\%name%\*"
)
exit /b
:set_separation
set "separation=------------------------------------------------------------------------------"
exit /b
:how_to
title %name% - %version%
color 0f
1>&2 (
echo.
echo.
echo.
echo. HOW TO USE:
echo  ----------
echo.
echo  Drag-and-drop files/folders on %name%.cmd file
echo.
echo.
echo  ______________________________________________________________________________
echo.
echo.
echo.
echo. LIMITATIONS:
echo  -----------
echo.
echo  %name% does not support some characters.
echo.
echo  Use simple path/name like "C:\images\image.png"
echo. 
echo. 
echo. 
)
call:cleaning
1>nul 2>&1 pause
exit /b