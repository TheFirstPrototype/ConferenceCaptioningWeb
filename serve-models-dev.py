#!/usr/bin/env python3
"""Local dev server for testing the Parakeet ASR engine before models/ is live
on conferencecaptioning.com. Serves this repo root with CORS enabled, so the
extension (origin chrome-extension://<id>) can fetch cross-origin.

Usage: python3 serve-models-dev.py [port]   (default port 8787)
Then in options.html's hidden dev panel, point the base URL at
http://localhost:8787/models and enable test mode.
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
    HTTPServer(("127.0.0.1", port), CORSRequestHandler).serve_forever()
