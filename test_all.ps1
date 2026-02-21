$base = "http://localhost:8080"
$login = Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST -ContentType "application/json" -Body '{"usernameOrEmail":"admin","password":"admin"}' -UseBasicParsing
$token = ($login.Content | ConvertFrom-Json).accessToken
$h = @{"Authorization" = "Bearer $token" }
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$pass = 0; $fail = 0

Write-Output "=========================================="
Write-Output "   FULL SYSTEM TEST - $(Get-Date -Format 'HH:mm:ss')"
Write-Output "=========================================="

# ---- PUBLIC AUTH REGISTER ----
Write-Output ""
Write-Output "--- 0. PUBLIC REGISTER ---"
$regBody = "{`"name`":`"Public User`",`"username`":`"public$ts`",`"email`":`"public$ts@test.com`",`"password`":`"pass123`"}"
try {
    Invoke-WebRequest -Uri "$base/api/auth/register" -Method POST -ContentType "application/json" -Body $regBody -UseBasicParsing | Out-Null
    Write-Output "PASS: Public Register"; $pass++
}
catch {
    Write-Output "FAIL: Public Register - $($_.Exception.Message)"
    $fail++
}

# ---- AUTH ----
Write-Output ""
Write-Output "--- 1. AUTH ---"
Write-Output "PASS: Login - role=$(($login.Content | ConvertFrom-Json).role)"
$pass++

try {
    Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST -ContentType "application/json" -Body '{"usernameOrEmail":"admin","password":"WRONG"}' -UseBasicParsing | Out-Null
    Write-Output "FAIL: Bad login should be rejected"; $fail++
}
catch {
    Write-Output "PASS: Bad login rejected ($($_.Exception.Response.StatusCode))"; $pass++
}

try {
    Invoke-WebRequest -Uri "$base/api/students" -UseBasicParsing | Out-Null
    Write-Output "FAIL: Unauthenticated access should be blocked"; $fail++
}
catch {
    Write-Output "PASS: Unauthenticated access blocked ($($_.Exception.Response.StatusCode))"; $pass++
}

# ---- ACADEMIC YEAR ----
Write-Output ""
Write-Output "--- 2. ACADEMIC YEARS ---"
try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/years" -Method POST -ContentType "application/json" -Body "{`"name`":`"TestYear-$ts`",`"startDate`":`"2026-06-01`",`"endDate`":`"2027-05-31`",`"active`":true}" -Headers $h -UseBasicParsing
    $yearId = ($r.Content | ConvertFrom-Json).id
    Write-Output "PASS: Create Academic Year (id=$yearId)"; $pass++
}
catch { Write-Output "FAIL: Create Academic Year - $($_.Exception.Message)"; $fail++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/years" -Headers $h -UseBasicParsing
    $count = ($r.Content | ConvertFrom-Json).Length
    Write-Output "PASS: Get All Years (count=$count)"; $pass++
}
catch { Write-Output "FAIL: Get All Years - $($_.Exception.Message)"; $fail++ }

# ---- STANDARD ----
Write-Output ""
Write-Output "--- 3. STANDARDS ---"
try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/standards" -Method POST -ContentType "application/json" -Body '{"name":"Class 12"}' -Headers $h -UseBasicParsing
    $stdId = ($r.Content | ConvertFrom-Json).id
    Write-Output "PASS: Create Standard (id=$stdId)"; $pass++
}
catch { Write-Output "FAIL: Create Standard - $($_.Exception.Message)"; $fail++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/standards" -Headers $h -UseBasicParsing
    $count = ($r.Content | ConvertFrom-Json).Length
    Write-Output "PASS: Get All Standards (count=$count)"; $pass++
}
catch { Write-Output "FAIL: Get All Standards"; $fail++ }

# ---- SECTION ----
Write-Output ""
Write-Output "--- 4. SECTIONS ---"
try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/sections" -Method POST -ContentType "application/json" -Body '{"name":"D"}' -Headers $h -UseBasicParsing
    $secId = ($r.Content | ConvertFrom-Json).id
    Write-Output "PASS: Create Section (id=$secId)"; $pass++
}
catch { Write-Output "FAIL: Create Section - $($_.Exception.Message)"; $fail++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/sections" -Headers $h -UseBasicParsing
    $count = ($r.Content | ConvertFrom-Json).Length
    Write-Output "PASS: Get All Sections (count=$count)"; $pass++
}
catch { Write-Output "FAIL: Get All Sections"; $fail++ }

# ---- SUBJECT ----
Write-Output ""
Write-Output "--- 5. SUBJECTS ---"
try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/subjects" -Method POST -ContentType "application/json" -Body "{`"name`":`"Biology-$ts`",`"code`":`"BIO$ts`"}" -Headers $h -UseBasicParsing
    $subId = ($r.Content | ConvertFrom-Json).id
    Write-Output "PASS: Create Subject (id=$subId)"; $pass++
}
catch { Write-Output "FAIL: Create Subject - $($_.Exception.Message)"; $fail++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/academic/subjects" -Headers $h -UseBasicParsing
    $count = ($r.Content | ConvertFrom-Json).Length
    Write-Output "PASS: Get All Subjects (count=$count)"; $pass++
}
catch { Write-Output "FAIL: Get All Subjects"; $fail++ }

# ---- STUDENT ----
Write-Output ""
Write-Output "--- 6. STUDENTS ---"
$sb = "{`"firstName`":`"TestStu`",`"lastName`":`"Auto`",`"email`":`"stu$ts@auto.com`",`"username`":`"stu$ts`",`"password`":`"pass123`",`"gender`":`"Male`",`"dob`":`"2009-03-12`",`"guardianName`":`"Guardian`",`"guardianPhone`":`"9000000001`",`"academicYearId`":$yearId,`"standardId`":$stdId,`"sectionId`":$secId}"
try {
    $r = Invoke-WebRequest -Uri "$base/api/students/register" -Method POST -ContentType "application/json" -Body $sb -Headers $h -UseBasicParsing
    $student = $r.Content | ConvertFrom-Json; $studentId = $student.id
    Write-Output "PASS: Register Student (id=$studentId, roll=$($student.rollNumber))"; $pass++
}
catch { Write-Output "FAIL: Register Student - $($_.Exception.Message)"; $fail++ }

try {
    Invoke-WebRequest -Uri "$base/api/students/register" -Method POST -ContentType "application/json" -Body $sb -Headers $h -UseBasicParsing | Out-Null
    Write-Output "FAIL: Duplicate student not rejected"; $fail++
}
catch { Write-Output "PASS: Duplicate student rejected ($($_.Exception.Response.StatusCode))"; $pass++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/students" -Headers $h -UseBasicParsing
    $count = ($r.Content | ConvertFrom-Json).Length
    Write-Output "PASS: Get All Students (count=$count)"; $pass++
}
catch { Write-Output "FAIL: Get All Students"; $fail++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/students/$studentId" -Headers $h -UseBasicParsing
    Write-Output "PASS: Get Student By ID ($($($r.Content | ConvertFrom-Json).firstName))"; $pass++
}
catch { Write-Output "FAIL: Get Student By ID"; $fail++ }

try {
    $ub = "{`"firstName`":`"UpdatedStu`",`"lastName`":`"Auto`",`"email`":`"stu$ts@auto.com`",`"gender`":`"Male`",`"dob`":`"2009-03-12`",`"guardianName`":`"UpdatedG`",`"guardianPhone`":`"9000000002`"}"
    $r = Invoke-WebRequest -Uri "$base/api/students/$studentId" -Method PUT -ContentType "application/json" -Body $ub -Headers $h -UseBasicParsing
    Write-Output "PASS: Update Student (firstName=$(($r.Content | ConvertFrom-Json).firstName))"; $pass++
}
catch { Write-Output "FAIL: Update Student - $($_.Exception.Message)"; $fail++ }

# ---- TEACHER ----
Write-Output ""
Write-Output "--- 7. TEACHERS ---"
$tb = "{`"firstName`":`"Dr`",`"lastName`":`"Auto`",`"email`":`"teacher$ts@auto.com`",`"username`":`"teacher$ts`",`"password`":`"pass123`",`"qualification`":`"PhD`",`"experience`":`"5 years`",`"subjectIds`":[$subId]}"
try {
    $r = Invoke-WebRequest -Uri "$base/api/teachers/register" -Method POST -ContentType "application/json" -Body $tb -Headers $h -UseBasicParsing
    $teacher = $r.Content | ConvertFrom-Json; $teacherId = $teacher.id
    Write-Output "PASS: Register Teacher (id=$teacherId, subjects=$($teacher.subjectIds))"; $pass++
}
catch { Write-Output "FAIL: Register Teacher - $($_.Exception.Message)"; $fail++ }

try {
    Invoke-WebRequest -Uri "$base/api/teachers/register" -Method POST -ContentType "application/json" -Body $tb -Headers $h -UseBasicParsing | Out-Null
    Write-Output "FAIL: Duplicate teacher not rejected"; $fail++
}
catch { Write-Output "PASS: Duplicate teacher rejected ($($_.Exception.Response.StatusCode))"; $pass++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/teachers" -Headers $h -UseBasicParsing
    $count = ($r.Content | ConvertFrom-Json).Length
    Write-Output "PASS: Get All Teachers (count=$count)"; $pass++
}
catch { Write-Output "FAIL: Get All Teachers"; $fail++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/teachers/$teacherId" -Headers $h -UseBasicParsing
    Write-Output "PASS: Get Teacher By ID ($($($r.Content | ConvertFrom-Json).firstName))"; $pass++
}
catch { Write-Output "FAIL: Get Teacher By ID"; $fail++ }

try {
    $tub = "{`"firstName`":`"Dr Updated`",`"lastName`":`"Auto`",`"email`":`"teacher$ts@auto.com`",`"qualification`":`"PhD+PostDoc`",`"experience`":`"10 years`",`"subjectIds`":[$subId]}"
    $r = Invoke-WebRequest -Uri "$base/api/teachers/$teacherId" -Method PUT -ContentType "application/json" -Body $tub -Headers $h -UseBasicParsing
    Write-Output "PASS: Update Teacher (firstName=$(($r.Content | ConvertFrom-Json).firstName))"; $pass++
}
catch { Write-Output "FAIL: Update Teacher - $($_.Exception.Message)"; $fail++ }

# ---- DELETE ----
Write-Output ""
Write-Output "--- 8. DELETE ---"
try {
    $r = Invoke-WebRequest -Uri "$base/api/students/$studentId" -Method DELETE -Headers $h -UseBasicParsing
    Write-Output "PASS: Delete Student ($($r.StatusCode))"; $pass++
}
catch { Write-Output "FAIL: Delete Student - $($_.Exception.Message)"; $fail++ }

try {
    $r = Invoke-WebRequest -Uri "$base/api/teachers/$teacherId" -Method DELETE -Headers $h -UseBasicParsing
    Write-Output "PASS: Delete Teacher ($($r.StatusCode))"; $pass++
}
catch { Write-Output "FAIL: Delete Teacher - $($_.Exception.Message)"; $fail++ }

# ---- SUMMARY ----
Write-Output ""
Write-Output "=========================================="
Write-Output "  RESULTS: $pass PASSED  |  $fail FAILED"
Write-Output "=========================================="
