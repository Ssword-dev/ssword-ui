$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:PATH += ";$dir"
