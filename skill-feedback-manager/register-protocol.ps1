# Register openfolder:// custom URI protocol in Windows Registry
# Run once with administrator privileges if needed (HKCU should not require admin)

$ErrorActionPreference = "Stop"

$regPath = "HKCU:\Software\Classes\openfolder"
$homeDir = $env:USERPROFILE
$skillDir = "$homeDir\.claude\skills\skill-feedback-manager"
$launcherPath = "$skillDir\open-folder-launcher.vbs"

# Create registry key
New-Item -Path $regPath -Force | Out-Null
Set-ItemProperty -Path $regPath -Name "(Default)" -Value "URL:Open Folder Protocol" -Type String
Set-ItemProperty -Path $regPath -Name "URL Protocol" -Value "" -Type String

# DefaultIcon
New-Item -Path "$regPath\DefaultIcon" -Force | Out-Null
Set-ItemProperty -Path "$regPath\DefaultIcon" -Name "(Default)" -Value "shell32.dll,3" -Type String

# Shell open command
New-Item -Path "$regPath\shell\open\command" -Force | Out-Null
Set-ItemProperty -Path "$regPath\shell\open\command" -Name "(Default)" -Value "wscript `"$launcherPath`" `"%1`"" -Type String

Write-Host "openfolder:// protocol registered successfully."
Write-Host "Launcher: $launcherPath"
