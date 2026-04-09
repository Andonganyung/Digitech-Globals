# Update all logos to include tagline

$files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals" -Filter "*.html" -Recurse

# Pattern 1: Logo without tagline
$pattern1 = @'
<img src="images/dg-logo.png" alt="DG Logo" class="logo-icon">
                <span>DigiTech<strong>Globals</strong></span>
'@

$replacement = @'
<img src="images/dg-logo.png" alt="DG Logo" class="logo-icon">
                <div class="logo-text">
                    <span>DigiTech<strong>Globals</strong></span>
                    <span class="logo-tagline">Engineering the Future of IT</span>
                </div>
'@

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $updated = $false
    
    if ($content -match [regex]::Escape($pattern1)) {
        $content = $content -replace [regex]::Escape($pattern1), $replacement
        $updated = $true
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $count++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal files updated: $count"
