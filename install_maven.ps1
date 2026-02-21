$ErrorActionPreference = "Stop"

# Maven Version
$mavenVersion = "3.9.9"
$installDir = "$env:USERPROFILE\.maven"
$mavenHome = "$installDir\apache-maven-$mavenVersion"
$mavenBin = "$mavenHome\bin"

# URLs to try (Main mirror first, then Archive as backup)
$urls = @(
    "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
    "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
)

Write-Host "Checking for Maven..."

if (Test-Path "$mavenBin\mvn.cmd") {
    Write-Host "Maven found at $mavenBin"
}
else {
    Write-Host "Maven not found."
    
    if (-not (Test-Path $installDir)) {
        New-Item -ItemType Directory -Force -Path $installDir | Out-Null
    }

    $zipPath = "$installDir\maven.zip"
    $downloaded = $false

    foreach ($url in $urls) {
        try {
            Write-Host "Trying to download from: $url..."
            Invoke-WebRequest -Uri $url -OutFile $zipPath
            $downloaded = $true
            break
        }
        catch {
            Write-Warning "Failed to download from $url. Trying next..."
        }
    }

    if (-not $downloaded) {
        Write-Error "Failed to download Maven from all sources. Please check internet connection."
        exit 1
    }

    Write-Host "Extracting Maven..."
    Expand-Archive -Path $zipPath -DestinationPath $installDir -Force

    Remove-Item $zipPath
    Write-Host "Maven downloaded and extracted."
}

# Add to PATH permanently for User
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$mavenBin*") {
    $newPath = "$mavenBin;$currentPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Updated User PATH with Maven bin."
}

[Environment]::SetEnvironmentVariable("M2_HOME", $mavenHome, "User")
Write-Host "Set M2_HOME variable."

Write-Host "Maven setup complete."
Write-Host "IMPORTANT: Please RESTART your terminal (close and open a new one) for the changes to take effect."
Write-Host "After restarting, run: mvn spring-boot:run"

# For current verification
$env:PATH = "$mavenBin;$env:PATH"
& "$mavenBin\mvn" -version
