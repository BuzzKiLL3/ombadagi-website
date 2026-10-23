#!/usr/bin/env python3
"""Render the social image and PNG icons for the Verom site.
Run after build.mjs:  PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 verom-src/make-images.py
Requires Playwright with Chromium. Output goes to /verom."""
import pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "verom"
FONT = (OUT / "assets/fonts").as_uri()

MARK = ('<svg viewBox="0 0 32 32" fill="none"><path d="M6.5 7.5 15 25" stroke="{a}" stroke-width="4" stroke-linecap="round"/>'
        '<path d="M25.5 7.5 17.2 24.2" stroke="{b}" stroke-width="4" stroke-linecap="round"/>'
        '<circle cx="25.5" cy="7.5" r="3.4" fill="{b}"/></svg>')

BASE = f"""<style>
@font-face{{font-family:Inter;font-weight:400;src:url({FONT}/inter-regular.woff)}}
@font-face{{font-family:Inter;font-weight:500;src:url({FONT}/inter-medium.woff)}}
@font-face{{font-family:Inter;font-weight:600;src:url({FONT}/inter-semibold.woff)}}
*{{margin:0;box-sizing:border-box}} body{{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}}
</style>"""

OG = BASE + f"""<div style="width:1200px;height:630px;background:#060A14;color:#E9EDF8;position:relative;overflow:hidden;padding:72px 80px;display:flex;flex-direction:column">
<div style="position:absolute;inset:0;background:radial-gradient(700px 380px at 85% 0%,rgba(76,91,255,.32),transparent 70%)"></div>
<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(170,186,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(170,186,255,.09) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse 60% 70% at 80% 30%,#000 10%,transparent 75%)"></div>
<div style="position:relative;display:flex;align-items:center;gap:18px">
  <div style="width:56px;height:56px">{MARK.format(a="#E9EDF8", b="#8D97FF")}</div>
  <div><div style="font-weight:600;letter-spacing:.16em;font-size:30px;line-height:1">VEROM</div>
  <div style="font-family:monospace;font-size:13px;letter-spacing:.34em;opacity:.66;margin-top:6px">SOLUTIONS</div></div>
</div>
<div style="position:relative;margin-top:auto">
  <div style="font-size:60px;font-weight:600;letter-spacing:-.035em;line-height:1.08;max-width:1060px">Software that simplifies business.<br><span style="color:#9AA5C2">Automation that moves it forward.</span></div>
  <div style="display:flex;gap:12px;margin-top:40px;font-size:20px;font-weight:500">
    <span style="padding:10px 16px;border:1px solid rgba(170,186,255,.24);border-radius:8px"><span style="color:#A3ACFF">●</span>&nbsp; Quotation ERP</span>
    <span style="padding:10px 16px;border:1px solid rgba(170,186,255,.24);border-radius:8px"><span style="color:#4FD8C4">●</span>&nbsp; WhatsApp Automation</span>
    <span style="padding:10px 16px;border:1px solid rgba(170,186,255,.24);border-radius:8px"><span style="color:#F2BC5E">●</span>&nbsp; Digital Twins</span>
    <span style="margin-left:auto;align-self:center;color:#9AA5C2;font-size:18px">verom.ombadagi.com</span>
  </div>
</div></div>"""

def icon(size, pad):
    r = round(size * 0.22)
    inner = size - 2 * pad
    return BASE + f'<div style="width:{size}px;height:{size}px;background:#0A1020;border-radius:{r}px;display:grid;place-items:center"><div style="width:{inner}px;height:{inner}px">{MARK.format(a="#E9EDF8", b="#8D97FF")}</div></div>'

def full_icon(size, pad):  # square, no rounding (for manifest / apple)
    inner = size - 2 * pad
    return BASE + f'<div style="width:{size}px;height:{size}px;background:#0A1020;display:grid;place-items:center"><div style="width:{inner}px;height:{inner}px">{MARK.format(a="#E9EDF8", b="#8D97FF")}</div></div>'

JOBS = [
    ("og.png", OG, 1200, 630, False),
    ("favicon-32.png", icon(32, 3), 32, 32, True),
    ("apple-touch-icon.png", full_icon(180, 36), 180, 180, False),
    ("assets/logo-192.png", full_icon(192, 40), 192, 192, False),
    ("assets/logo-512.png", full_icon(512, 104), 512, 512, False),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    for name, html, w, h, transparent in JOBS:
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.set_content(f"<html><body style='background:transparent'>{html}</body></html>")
        pg.wait_for_timeout(250)
        pg.screenshot(path=str(OUT / name), omit_background=transparent, clip={"x": 0, "y": 0, "width": w, "height": h})
        print("wrote", name)
    b.close()
