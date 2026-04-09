# Replace emoji globe with DG Logo image

$files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals" -Filter "*.html" -Recurse

$oldPattern = '<span class="logo-icon">🌐</span>'
$newLogo = '<img src="images/dg-logo.png" alt="DG Logo" class="logo-icon">'

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
