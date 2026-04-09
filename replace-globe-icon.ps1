# Replace Font Awesome globe icon with Unicode emoji

$files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals" -Filter "*.html" -Recurse

$oldPattern = '<i class="fas fa-globe"></i>'
$newIcon = '<span class="logo-icon">🌐</span>'

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($oldPattern)) {
        $content = $content -replace [regex]::Escape($oldPattern), $newIcon
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $count++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal files updated: $count"
