#!/usr/bin/env python3
"""Tiny static server for the Web Dev Playground. Run:  python3 server.py"""
import http.server, socketserver, os, sys, webbrowser, threading

PORT = int(os.environ.get("PORT", 4173))
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def end_headers(self):
        # never cache, so edits show up on refresh
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # keep the terminal quiet


def main():
    global PORT
    for attempt in range(20):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", PORT), Handler)
            break
        except OSError:
            PORT += 1
    else:
        print("Could not find a free port.")
        sys.exit(1)

    url = f"http://localhost:{PORT}/"
    print("\n  Web Dev Playground is running\n")
    print(f"    {url}\n")
    print("  Leave this window open while you work.")
    print("  Press Ctrl+C (or just close the window) to stop.\n")
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped.\n")


if __name__ == "__main__":
    main()
