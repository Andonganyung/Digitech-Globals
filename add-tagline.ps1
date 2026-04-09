# Add tagline "Engineering the Future of IT" to all logo instances

$files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals" -Filter "*.html" -Recurse

$oldPattern = '<img src="images/dg-logo.png" alt="DG Logo" class="logo-icon">
                <span>DigiTech<strong>Globals</strong></span>'

$newLogo = '<img src="images/dg-logo.png" alt="DG Logo" class="logo-icon">
                <div class="logo-text">
                    <span>DigiTech<strong>Globals</strong></span>
                    <span class="logo-tagline">Engineering the Future of IT</span>
                </div>'

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($oldPattern)) {
        $content = $content -replace [regex]::Escape($oldPattern), $newLogo
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $count++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal files updated: $count"
