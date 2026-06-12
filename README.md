# 🎵 Chad - High-Performance Discord Audio Bot

Chad is a streamlined, enterprise-ready Discord music bot built using **Node.js v20**, **Discord.js v14**, and **Discord-Player v7**. It is designed with robust error handling, rich UI visualizers, a containerized execution environment, and an automated continuous deployment lifecycle.

---

## ⚡ Features

* **Zero-Configuration Playback:** Automatically handles connection states, voice channel synchronization, and track streaming.
* **Rich UI Visualizers:** Leverages stylized Discord Embed panels for real-time status updates and session synchronization.
* **Advanced Queue Management:** Tracks deep queues without performance degradation or memory leaks.
* **Multi-Environment Configuration:** Seamlessly switches between local config files and high-security system environment variables.
* **Cloud Native Ready:** Shipped with pre-configured operational support for Docker virtualization and Jenkins CI/CD pipelines.

---

## 🛠️ Slash Commands Reference

| Command | Parameter | Description |
| :--- | :--- | :--- |
| `/join` | *None* | Prepares Chad and signals voice connection availability. |
| `/play` | `query` *(String/URL)* | Searches, joins, stacks, and streams audio data. |
| `/skip` | *None* | Advances to the next structural item in the audio queue. |
| `/queue` | *None* | Displays a rich visual matrix of active and upcoming tracks. |
| `/stop` | *None* | Destroys the audio engine instance, flushes the queue, and leaves. |
| `/credits` | *None* | Displays underlying infrastructure layout and architect details. |

---

## 💻 Local Setup & Development

### Prerequisites
* Node.js v20.x installed on your host machine.
* An active Discord Application configuration via the Developer Portal.

### Installation
1. Clone or download your project repository structure.
2. Open your terminal in the project directory and pull in system packages:
   ```bash
   npm install"# chad-bot" 
