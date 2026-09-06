---
title: "RFID Attendance System"
description: "Classroom attendance tracked with RFID cards, from Arduino hardware to a real-time web dashboard."
repo: "RFID-Attendance-system"
url: "https://github.com/AkshatAggarwal14/RFID-Attendance-system"
language: "JavaScript"
stars: 2
stack: ["Arduino", "Node.js", "Express", "Mongoose", "MongoDB", "React"]
images:
  - { src: "/projects/rfid-attendance-system/frontend-1.jpg", alt: "Attendance dashboard updating in real time", caption: "Live attendance dashboard" }
  - { src: "/projects/rfid-attendance-system/frontend-2.jpg", alt: "Dashboard view of present students", caption: "Present-student list as cards are swiped" }
  - { src: "/projects/rfid-attendance-system/circuit-schematic.png", alt: "Wiring schematic for Arduino Uno and RFID-RC522 reader", caption: "Wiring schematic (Arduino Uno + RFID-RC522)" }
order: 1
---

Group project: an RFID-RC522 reader on Arduino Uno captures card scans, with LED and buzzer feedback on every tap.

Scans stream over serial to a Node.js and Express backend that persists attendance in MongoDB via Mongoose. The React frontend shows the present-student list updating in real time as cards are swiped.

Shipped with a full wiring schematic and setup guide, from library install to running both servers.
