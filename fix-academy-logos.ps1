# Fix academy page logos - correct path and add tagline

$files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals\academy" -Filter "*.html"

# Pattern for academy pages with wrong path
$pattern1 = '<a href="../index.html" class="logo"><img src="images/dg-logo.png" alt="DG Logo" class="logo-icon"><span>DigiTech<strong>Globals</strong></span></a>'

$replacement1 = @'
<a href="../index.html" class="logo">
                <img src="../images/dg-logo.png" alt="DG Logo" class="logo-icon">
                <div class="logo-text">
                    <span>DigiTech<strong>Globals</strong></span>
                    <span class="logo-tagline">Engineering the Future of IT</span>
                </div>
            </a>
'@

# Pattern for academy pages with correct path but no tagline
$pattern2 = @'
<img src="../images/dg-logo.png" alt="DG Logo" class="logo-icon">
                <span>DigiTech<strong>Globals</strong></span>
'@

$replacement2 = @'
<img src="../images/dg-logo.png" alt="DG Logo" class="logo-icon">
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
        $content = $content -replace [regex]::Escape($pattern1), $replacement1
        $updated = $true
    }
    elseif ($content -match [regex]::Escape($pattern2)) {
        $content = $content -replace [regex]::Escape($pattern2), $replacement2
        $updated = $true
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $count++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal files updated: $count"
