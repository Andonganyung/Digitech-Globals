# Update all Enroll button links to point to register.html with course ID

$coursesFile = "courses.html"
$content = Get-Content $coursesFile -Raw

# Pattern to find course detail links and extract course IDs
$pattern = '<a href="([\w-]+)\.html" class="btn btn-outline btn-sm">Learn More</a>'

# Find all matches and extract course IDs
$matches = [regex]::Matches($content, $pattern)
$courseIds = @()

foreach ($match in $matches) {
    $courseId = $match.Groups[1].Value
    if ($courseId -ne "course-detail") {  # Skip generic templates
        $courseIds += $courseId
    }
}

# Replace each contact.html link with corresponding register.html?course=ID
foreach ($courseId in $courseIds) {
    # Find the Enroll button before this course's Learn More button
    $oldPattern = '(<a href=")\.\.\/contact\.html(" class="btn btn-primary btn-sm">Enroll</a>\s*<a href="' + $courseId + '\.html")'
    $newPattern = '$1register.html?course=' + $courseId + '$2'
    
    $content = $content -replace $oldPattern, $newPattern
}

# Save updated content
$content | Set-Content $coursesFile

Write-Host "Updated all Enroll buttons to link to registration page"
Write-Host "Total courses updated: $($courseIds.Count)"
