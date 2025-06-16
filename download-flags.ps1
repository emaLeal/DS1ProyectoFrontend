$spanishFlagUrl = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/es.svg"
$englishFlagUrl = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/gb.svg"

$outputPath = "src/assets/img"

if (-not (Test-Path $outputPath)) {
    New-Item -ItemType Directory -Path $outputPath -Force
}

Invoke-WebRequest -Uri $spanishFlagUrl -OutFile "$outputPath/spanish-logo.png"
Invoke-WebRequest -Uri $englishFlagUrl -OutFile "$outputPath/english-logo.png"

Write-Host "Banderas descargadas correctamente en $outputPath" 