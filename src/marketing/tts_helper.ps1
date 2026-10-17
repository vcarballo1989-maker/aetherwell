param (
    [string]$Text,
    [string]$OutputFile
)

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Helena Desktop')
$synth.Rate = 0
$synth.SetOutputToWaveFile($OutputFile)
$synth.Speak($Text)
$synth.Dispose()
Write-Host "TTS_SUCCESS: $OutputFile"
