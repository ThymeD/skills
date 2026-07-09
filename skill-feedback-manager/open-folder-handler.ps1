# open-folder-handler.ps1
# Handles openfolder:// URIs and opens the target folder in Explorer
# Usage: openfolder:///D:/path → opens D:\path in Explorer

param([string]$uri)

Add-Type -Name Window -Namespace Console -MemberDefinition '
[DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
[DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
[DllImport("user32.dll")] public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);
[DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
[DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
'

$SW_RESTORE = 9

# Parse URI: openfolder:///D:/path → D:\path
$folderPath = $uri -replace '^openfolder:/+', ''
$folderPath = [Uri]::UnescapeDataString($folderPath)
$folderPath = $folderPath -replace '/', '\'
$folderPath = $folderPath -replace '^\\+', ''

# Validate
if (-not (Test-Path $folderPath)) {
    Write-Error "Directory not found: $folderPath"
    exit 1
}

# Open Explorer
$currentFg = [Console.Window]::GetForegroundWindow()
$threadId = 0
[Console.Window]::GetWindowThreadProcessId($currentFg, [ref]$threadId)
$currentThread = [System.Threading.Thread]::CurrentThread.ManagedThreadId

# Attach thread input to steal focus
[Console.Window]::AttachThreadInput($currentThread, $threadId, $true)

try {
    Start-Process "explorer.exe" -ArgumentList $folderPath

    # Wait for window to appear
    Start-Sleep -Milliseconds 800

    $newFg = [Console.Window]::GetForegroundWindow()
    [Console.Window]::ShowWindow($newFg, $SW_RESTORE)
    [Console.Window]::BringWindowToTop($newFg)
    [Console.Window]::SetForegroundWindow($newFg)
} finally {
    [Console.Window]::AttachThreadInput($currentThread, $threadId, $false)
}
