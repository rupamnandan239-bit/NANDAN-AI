$port = 5000
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)

try {
    $listener.Start()
} catch {
    $port = 5001
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    $listener.Start()
}

Write-Host "Server running at http://localhost:$port/"
$rootDir = $PSScriptRoot

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".ico"  = "image/x-icon"
    ".mp4"  = "video/mp4"
}

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII)

        $requestLine = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($requestLine)) {
            $client.Close()
            continue
        }

        $tokens = $requestLine.Split(' ')
        if ($tokens.Length -lt 2) {
            $client.Close()
            continue
        }

        $path = $tokens[1]
        if ($path -eq "/" -or [string]::IsNullOrWhiteSpace($path)) {
            $path = "/index.html"
        }

        # remove query string if any
        if ($path.Contains("?")) {
            $path = $path.Substring(0, $path.IndexOf("?"))
        }

        $decodedPath = [System.Uri]::UnescapeDataString($path)
        $cleanRelPath = $decodedPath.TrimStart('/').Replace('/', '\')
        $filePath = [System.IO.Path]::Combine($rootDir, $cleanRelPath)

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)

            $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nCache-Control: public, max-age=3600`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
        } else {
            $msg = "404 Not Found"
            $msgBytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($msgBytes.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($msgBytes, 0, $msgBytes.Length)
        }
        $stream.Flush()
        $client.Close()
    } catch {
        # continue accepting clients
    }
}
