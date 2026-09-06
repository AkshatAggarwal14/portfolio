---
title: "NITH Announcements"
description: "HTTP API serving NIT Hamirpur announcements, built to feed Discord bots and other integrations."
repo: "NITH-Announcements"
url: "https://github.com/AkshatAggarwal14/NITH-Announcements"
language: "Python"
demo: "https://nithannouncements.vercel.app/"
stack: ["Python", "FastAPI", "Vercel", "HTTP API"]
order: 3
---

Scrapes announcements from the NIT Hamirpur website and serves them over HTTP, split cleanly into scraper and server modules.

Designed as a backend for Discord bots: any client polls one endpoint instead of scraping HTML itself. Deployed on Vercel (migrated off discontinued Deta): `GET /api/announcements` and `/announcements` serve data, `GET /docs` serves Swagger UI.
