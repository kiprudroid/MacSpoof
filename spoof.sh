#!/bin/bash

IFACE="enp0s25"
CON_NAME=$(nmcli -g GENERAL.CONNECTION device show $IFACE)
NODE_SCRIPT="/home/shadrack/MacSpoof/refresh-portal/withAxios.js"
LOG="/var/log/quickwave.log"

echo "[$(date)] === Starting cycle ===" >> $LOG

# Step 1: Spoof MAC
echo "[*] Disconnecting..." >> $LOG
sudo nmcli device disconnect $IFACE

sudo ip link set $IFACE down
sudo macchanger -e $IFACE >> $LOG
sudo ip link set $IFACE up

echo "[*] Waiting for carrier..." >> $LOG
sleep 2

sudo nmcli connection up "$CON_NAME"
echo "[*] Reconnected with new MAC" >> $LOG

# Step 2: Wait for portal to be reachable
sleep 4

# Step 3: Run selenium once
echo "[*] Running portal script..." >> $LOG
/home/shadrack/.local/share/fnm/node-versions/v22.6.0/installation/bin/node $NODE_SCRIPT >> $LOG 2>&1
echo "[$(date)] === Cycle done ===" >> $LOG
