# Clean and Start Development Server
# Run this script if you encounter EPERM errors

Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow

# Stop all Node processes
Write-Host "Stopping Node processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait for processes to fully terminate
Start-Sleep -Seconds 2

# Remove .next directory
if (Test-Path '.next') {
    Write-Host "Removing .next directory..." -ForegroundColor Cyan
    Remove-Item '.next' -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove node_modules/.cache
if (Test-Path 'node_modules/.cache') {
    Write-Host "Removing node_modules cache..." -ForegroundColor Cyan
    Remove-Item 'node_modules/.cache' -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Yellow

# Start dev server
npm run dev

