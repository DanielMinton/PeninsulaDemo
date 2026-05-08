#!/usr/bin/env bash
#
# Verify each shipped locale renders translated content (not English fallback).
# Run after dev server is up:  ./scripts/verify-locales.sh
#
# Pass: every shipping locale's H1 differs from the English source.
# Fail: any locale's H1 still says "The Pickup".

set -uo pipefail
HOST="${HOST:-http://localhost:3000}"
EN_H1="The Pickup"
PASS=0
FAIL=0

# Shipping locales — translation files committed.
SHIPPING=(en es-MX zh-Hans vi ko ja ru fil pt-BR)
# Pending locales — corpus authored, awaiting `npm run translate`.
PENDING=(id nl de he tlh)
# Stub locales — corpus not authored.
STUBS=(ur)

echo "=== Shipping locales (H1 must differ from English) ==="
for loc in "${SHIPPING[@]}"; do
  if [[ "$loc" == "en" ]]; then
    url="${HOST}/"
  else
    url="${HOST}/${loc}"
  fi
  h1=$(curl -s -L "$url" | grep -oE '<h1[^>]*>[^<]+' | head -1 | sed -E 's/<h1[^>]*>//')

  if [[ "$loc" == "en" ]]; then
    [[ "$h1" == *"$EN_H1"* ]] && { printf "  %-10s ✓ %s\n" "$loc" "$h1"; PASS=$((PASS+1)); } || { printf "  %-10s ✗ expected '%s', got '%s'\n" "$loc" "$EN_H1" "$h1"; FAIL=$((FAIL+1)); }
  else
    [[ "$h1" == *"$EN_H1"* ]] && { printf "  %-10s ✗ STILL ENGLISH: '%s'\n" "$loc" "$h1"; FAIL=$((FAIL+1)); } || { printf "  %-10s ✓ %s\n" "$loc" "$h1"; PASS=$((PASS+1)); }
  fi
done

echo
echo "=== Pending locales (corpus authored, awaiting translate run) ==="
for loc in "${PENDING[@]}"; do
  url="${HOST}/${loc}"
  h1=$(curl -s -L "$url" | grep -oE '<h1[^>]*>[^<]+' | head -1 | sed -E 's/<h1[^>]*>//')
  printf "  %-10s ⏳ english fallback: '%s'\n" "$loc" "$h1"
done

echo
echo "=== Stub locales (corpus not authored, English fallback expected) ==="
for loc in "${STUBS[@]}"; do
  url="${HOST}/${loc}"
  h1=$(curl -s -L "$url" | grep -oE '<h1[^>]*>[^<]+' | head -1 | sed -E 's/<h1[^>]*>//')
  [[ "$h1" == *"$EN_H1"* ]] && printf "  %-10s ✓ fallback to en: '%s'\n" "$loc" "$h1" || printf "  %-10s ⚠ unexpected: '%s'\n" "$loc" "$h1"
done

echo
echo "=== <html dir=\"rtl\"> for he and ur ==="
for loc in he ur; do
  attrs=$(curl -s -L "${HOST}/${loc}" | grep -oE '<html[^>]*' | head -1)
  echo "  $loc: $attrs"
done

echo
if [[ $FAIL -eq 0 ]]; then
  echo "PASS: ${PASS} shipping locales render translated content."
  exit 0
else
  echo "FAIL: ${FAIL} shipping locale(s) still serving English."
  exit 1
fi
