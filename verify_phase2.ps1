# verify_phase2.ps1

$BaseUrl = "http://localhost:8080/api"
$AdminUser = "admin"
$AdminPass = "password"

# 1. Login as Admin
Write-Host "1. Logging in as Admin..."
$loginBody = @{ usernameOrEmail = $AdminUser; password = $AdminPass } | ConvertTo-Json
try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.accessToken
    Write-Host "   Success! Token: $token"
}
catch {
    Write-Error "   Login Failed: $_"
    exit 1
}

$headers = @{ Authorization = "Bearer $token" }

# 2. Create Academic Year
Write-Host "`n2. Creating Academic Year..."
$yearBody = @{ name = "2024-2025"; startDate = "2024-06-01"; endDate = "2025-05-31"; active = $true } | ConvertTo-Json
try {
    $year = Invoke-RestMethod -Uri "$BaseUrl/academic/years" -Method Post -Headers $headers -Body $yearBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   Success! Year ID: $($year.id)"
}
catch {
    Write-Error "   Failed: $_"
}

# 3. Create Standard
Write-Host "`n3. Creating Standard (Class)..."
$stdBody = @{ name = "Grade 10" } | ConvertTo-Json
try {
    $std = Invoke-RestMethod -Uri "$BaseUrl/academic/standards" -Method Post -Headers $headers -Body $stdBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   Success! Standard ID: $($std.id)"
}
catch {
    Write-Error "   Failed: $_"
}

# 4. Create Section
Write-Host "`n4. Creating Section..."
$secBody = @{ name = "A" } | ConvertTo-Json
try {
    $sec = Invoke-RestMethod -Uri "$BaseUrl/academic/sections" -Method Post -Headers $headers -Body $secBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   Success! Section ID: $($sec.id)"
}
catch {
    Write-Error "   Failed: $_"
}

# 5. Create Subject
Write-Host "`n5. Creating Subject..."
$subBody = @{ name = "Mathematics"; code = "MATH101" } | ConvertTo-Json
try {
    $sub = Invoke-RestMethod -Uri "$BaseUrl/academic/subjects" -Method Post -Headers $headers -Body $subBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   Success! Subject ID: $($sub.id)"
}
catch {
    Write-Error "   Failed: $_"
}

# 6. Register Student
Write-Host "`n6. Registering Student (Admin)..."
$studentBody = @{
    firstName      = "John"
    lastName       = "Doe"
    email          = "john.doe@test.com"
    username       = "johndoe"
    password       = "password123"
    gender         = "Male"
    academicYearId = $year.id
    standardId     = $std.id
    sectionId      = $sec.id
} | ConvertTo-Json

try {
    $student = Invoke-RestMethod -Uri "$BaseUrl/students/register" -Method Post -Headers $headers -Body $studentBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   Success! Student ID: $($student.id), Roll No: $($student.rollNumber)"
}
catch {
    Write-Error "   Registration Failed: $_"
    # echo $_.Exception.Response.GetResponseStream()
}

# 7. Login as Student
Write-Host "`n7. Logging in as New Student..."
$studentLogin = @{ usernameOrEmail = "johndoe"; password = "password123" } | ConvertTo-Json
try {
    $sLogin = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $studentLogin -ContentType "application/json" -ErrorAction Stop
    Write-Host "   Success! Student Role: $($sLogin.role)"
}
catch {
    Write-Error "   Student Login Failed: $_"
}
