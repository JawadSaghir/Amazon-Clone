$ErrorActionPreference = "SilentlyContinue"

$projectRoot = "D:\amazon_clone\new\8x_amazon_clone"
$captureScript = Join-Path $projectRoot "scripts\capture_codex_session.py"
$computerUseNotify = "C:\Users\jawad\AppData\Local\OpenAI\Codex\runtimes\cua_node\13827bafdc0b5422\bin\node_modules\@oai\sky\bin\windows\codex-computer-use.exe"

if (Test-Path -LiteralPath $captureScript) {
  python $captureScript --project-root $projectRoot --capture-cwd "D:\amazon_clone" --author "jawad" --project "8x_amazon_clone" --tool "codex-desktop" --model "gpt-5.5" | Out-Null
}

if (Test-Path -LiteralPath $computerUseNotify) {
  & $computerUseNotify turn-ended | Out-Null
}

exit 0
