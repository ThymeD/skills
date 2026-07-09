Set args = WScript.Arguments
If args.Count > 0 Then
    handlerPath = CreateObject("WScript.Shell").ExpandEnvironmentStrings("%USERPROFILE%") & "\.claude\skills\skill-feedback-manager\open-folder-handler.ps1"
    Set objShell = CreateObject("WScript.Shell")
    objShell.Run "powershell -NoProfile -ExecutionPolicy Bypass -File """ & handlerPath & """ """ & args(0) & """", 0, False
End If
