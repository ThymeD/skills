' Start skill-feedback-manager server silently (no console window)
Set objShell = CreateObject("WScript.Shell")
skillDir = objShell.ExpandEnvironmentStrings("%USERPROFILE%") & "\.claude\skills\skill-feedback-manager"
objShell.CurrentDirectory = skillDir
objShell.Run "node """ & skillDir & "\server.cjs""", 0, False
