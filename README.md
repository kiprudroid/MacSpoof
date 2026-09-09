# MacSpoof

A small script I put together to automate free wifi sessions on a local public network with a captive portal.

## The Idea

There's this wifi provider near me that sells data packages at different prices. One of their options is a "Free 20 mins Weekly for testing" pass -- it gives you unlimited wifi for 20 minutes each week so you can try before you buy.

The catch? Devices are tracked by MAC address. So after your 20 minutes are up, you're cut off until next week... unless your device looks like a different one.

On Linux, you can change your MAC address freely using `macchanger`. So I built a script that:

1. Spoofs the MAC address to a fresh random one
2. Reconnects to the network
3. Clicks the "Free Trial" link on the portal automatically
4. Repeats every 20 minutes via cron

## How It Works

### `spoof.sh`

The main script. It:

- Disconnects the network interface
- Uses `macchanger -e` to randomize the MAC address (keeps the vendor prefix for a more convincing look)
- Reconnects and waits for the captive portal to show up
- Runs the Node.js portal script to click the free trial link

This is the script that gets triggered by cron every 20 minutes.

### `restore_mac.sh`

A utility to revert the MAC address back to the original (permanent) one. Useful if you want to stop spoofing and use your real MAC again.

### `refresh-portal/`

A small Node.js app that handles the captive portal interaction. Two implementations:

- **`index.js`** -- Uses Selenium WebDriver to open a headless Chrome browser, navigate to the portal, find the "Click Here To Start Free Trial" link, and click it. This was the original approach but requires a full browser.
- **`withAxios.js`** -- A lighter version using just HTTP requests (Axios + Cheerio). It fetches the portal page, parses the HTML, finds the free trial link, and hits it directly. This is the one `spoof.sh` actually uses.

## Setup

### Prerequisites

- Linux (tested on a machine with `enp0s25` interface -- you'll need to change this to match yours)
- `macchanger` installed
- Node.js
- npm packages: `axios`, `cheerio` (for the HTTP method) or `selenium-webdriver` (if you want to use the browser method)

### Install dependencies

```bash
cd refresh-portal
npm install
```

### Cron setup

Add a cron entry to run the spoof script every 20 minutes:

```bash
crontab -e
```

Add this line:

```
*/20 * * * * /bin/bash /home/shadrack/MacSpoof/spoof.sh
```

### Logs

Everything gets logged to `/var/log/quickwave.log` so you can see what's happening.

## Notes

- Change the `IFACE` variable in `spoof.sh` to match your network interface (`ip link show` to find it).
- The Node path in `spoof.sh` is hardcoded to a specific fnm installation -- update it to match your setup.
- This is for educational purposes only. The provider might catch on eventually, or they might change how the portal works.

## License

None. Use at your own discretion.
