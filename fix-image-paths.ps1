# Fix all image paths in academy, blog, and services folders

$folders = @("academy", "blog", "services")

foreach ($folder in $folders) {
    $files = Get-ChildItem -Path "C:\Users\Andong\Digitech-Globals\$folder" -Filter "*.html"
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $updated = $false
        
        # Fix the image path
        if ($content -match 'src="images/dg-logo\.png"') {
            $content = $content -replace 'src="images/dg-logo\.png"', 'src="../images/dg-logo.png"'
            $updated = $true
            Write-Host "Fixed path in: $($file.FullName)"
        }
        
        if ($updated) {
            Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        }
    }
}

Write-Host "`nDone!"
