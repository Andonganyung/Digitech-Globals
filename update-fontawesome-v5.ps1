# Update Font Awesome to 5.15.4 (more stable version)

$files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals" -Filter "*.html" -Recurse

$oldPattern = 'https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/[^"]+\.css[^"]*'
$newLink = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match $oldPattern) {
        $content = $content -replace $oldPattern, $newLink
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal files updated: $count"
