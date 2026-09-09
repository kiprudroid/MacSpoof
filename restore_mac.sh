#!/bin/bash

IFACE="enp0s25"

echo "[*] Disconnecting..."
sudo nmcli device disconnect $IFACE

echo "[*] Bringing interface down..."
sudo ip link set $IFACE down

echo "[*] Reverting to original MAC..."
sudo macchanger -p $IFACE

echo "[*] Bringing interface back up..."
sudo ip link set $IFACE up

echo "[*] Reconnecting..."
sudo nmcli device connect $IFACE

echo "[*] Done. MAC restored:"
macchanger -s $IFACE
