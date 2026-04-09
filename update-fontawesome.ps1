# Update Font Awesome to 6.5.1 across all HTML files

$files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals" -Filter "*.html" -Recurse

$oldLink = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
$newLink = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer'

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match [regex]::Escape($oldLink)) {
        $content = $content -replace [regex]::Escape($oldLink), $newLink
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal files updated: $count"
