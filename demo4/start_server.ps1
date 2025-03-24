# 设置编码为UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 检查Python是否安装
try {
    $pythonVersion = python --version
    Write-Host "检测到Python版本: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未检测到Python，请确保已安装Python并添加到系统环境变量中" -ForegroundColor Red
    Write-Host "您可以从 https://www.python.org/downloads/ 下载并安装Python" -ForegroundColor Yellow
    Write-Host "按任意键退出..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# 获取当前目录
$currentDir = Get-Location
Write-Host "当前目录: $currentDir" -ForegroundColor Cyan

Write-Host "`n正在启动本地服务器..." -ForegroundColor Green
Write-Host "请在浏览器中访问: http://localhost:8000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 可以停止服务器" -ForegroundColor Yellow
Write-Host ""

try {
    # 启动Python简单服务器
    python -m http.server 8000
} catch {
    Write-Host "错误: 启动服务器失败" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host "按任意键退出..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
} 