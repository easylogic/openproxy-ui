#!/usr/bin/env bash
if [ "$1" = "start" ]; then
  networksetup -setwebproxy wi-fi $2 $3 && networksetup -setsecurewebproxy wi-fi $2 $3
else
  networksetup -setwebproxystate wi-fi off && networksetup -setsecurewebproxystate wi-fi off
fi