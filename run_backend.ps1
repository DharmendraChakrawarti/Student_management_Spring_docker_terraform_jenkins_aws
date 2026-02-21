$ErrorActionPreference = "Stop"

# Define the path to the Maven executable installed by install_maven.ps1
$mavenHome = "$env:USERPROFILE\.maven\apache-maven-3.9.9"
$mavenCmd = "$mavenHome\bin\mvn.cmd"

# Check if Maven exists at the expected location
if (-not (Test-Path $mavenCmd)) {
    Write-Error "Maven not found at $mavenCmd. Please run .\install_maven.ps1 first."
    exit 1
}

# Navigate to the backend directory
Set-Location -Path "$PSScriptRoot\student-management-backend"
Write-Host "Starting Backend from $PWD..."

# Execute the Spring Boot run command using the full path to Maven
# Execute the Spring Boot run command using the full path to Maven
& $mavenCmd spring-boot:run 2>&1 | Tee-Object -FilePath "..\run_debug.log"
