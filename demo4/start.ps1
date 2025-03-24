# 启动Python服务器
Write-Host "正在启动服务器..." -ForegroundColor Green
Write-Host "请访问: http://localhost:8000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
python -m http.server 8000