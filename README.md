## 💎 MoreLogin API Automation Example - Minersquad Bot

This project demonstrates how to use the **MoreLogin API** to automate web interactions within a managed browser
profile.  
It uses **Puppeteer** with the **Stealth Plugin** to simulate human-like actions on **Telegram Web**, specifically
interacting with the **Minersquad Bot**.

---

## 📌 Features

- ✅ Automated browser profile management using **MoreLogin API**.
- ✅ Interaction with **Telegram Web** to periodically click the "Start Mining" button.
- ✅ Stealth plugin usage to bypass bot detection.
- ✅ Flexible configuration through the `.env` file.
- ✅ Human-like interaction with random breaks to mimic real user behavior.

---

## 📂 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/morelogin-minersquad-bot.git
cd morelogin-minersquad-bot
```

2. **Install dependencies**

```bash
npm install
```

---

## 🔧 Configuration

Create a file named .env in the root of your project with the following content:

```ini
# MoreLogin API Settings
APP_ID = your_app_id
SECRET_KEY = your_secret_key
BASE_URL = https://example.com
ENCRYPT_KEY = your_encrypt_key

# Bot & Browser Settings
ENV_ID = 1872961988055343104                     # MoreLogin Environment ID
BASE_BREAK_TIME = 2000000                        # Base break time in milliseconds (e.g., 2000000 ms = 33.3 minutes)
TELEGRAM_URL = https://web.telegram.org/k/#@minersquad_bot
WAIT_TIME_MIN = 5                                # Minimum wait time between actions (in minutes)
WAIT_TIME_MAX = 12                               # Maximum wait time between actions (in minutes)
ADDITIONAL_TIME_MIN = 1                          # Minimum additional break time (in minutes)
ADDITIONAL_TIME_MAX = 8                          # Maximum additional break time (in minutes)
```

Replace:

your_app_id, your_secret_key, your_encrypt_key, and https://example.com with your MoreLogin API credentials.

ENV_ID with the environment ID of your MoreLogin browser profile.

TELEGRAM_URL with the URL of the Minersquad Bot in Telegram Web.

---

## 📜 Usage

Run the script with:

```bash
node bot.js
```

## 📁 Project Structure

```ini
morelogin-minersquad-bot/
│
├── morelogin.js         # API management for MoreLogin profile operations
├── bot.js               # Main script for interacting with the Minersquad Bot
├── .env                 # Configuration file (you need to create this)
├── README.md            # This documentation file
└── package.json         # Node.js package dependencies
```

---

## 🔍 How It Works

1. **Profile Management**
    * The script interacts with the **MoreLogin API** to start and stop a specific browser profile.
    * It establishes a connection with the profile using puppeteer.connect().
2. **Bot Interaction**
   * The script opens the specified Telegram Web URL and interacts with the Minersquad Bot.
   * It waits for the Start Mining button within an iframe and clicks it if found.
   * It repeats this process after random intervals to mimic human behavior.
3. **Stealth Plugin**
   * Uses puppeteer-extra-plugin-stealth to avoid detection by Telegram Web.

### 🔐 Environment Variables

| Variable               | Description                                                    |
|------------------------|----------------------------------------------------------------|
| `APP_ID`               | Your MoreLogin application ID.                                 |
| `SECRET_KEY`           | Your MoreLogin secret key.                                     |
| `BASE_URL`             | MoreLogin API base URL.                                        |
| `ENCRYPT_KEY`          | Your MoreLogin encryption key.                                 |
| `ENV_ID`               | Environment ID of the MoreLogin profile to control.           |
| `BASE_BREAK_TIME`      | Base break time between actions (in milliseconds).            |
| `TELEGRAM_URL`         | URL of the Telegram Web bot you want to automate.             |
| `WAIT_TIME_MIN`        | Minimum wait time before clicking the button again (minutes). |
| `WAIT_TIME_MAX`        | Maximum wait time before clicking the button again (minutes). |
| `ADDITIONAL_TIME_MIN`  | Minimum extra break time after each cycle (minutes).          |
| `ADDITIONAL_TIME_MAX`  | Maximum extra break time after each cycle (minutes).          |

### 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.