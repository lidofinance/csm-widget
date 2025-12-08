#!/usr/bin/env bash
set -euo pipefail
OS_UNAME=$(uname -s)
case "$OS_UNAME" in
  Darwin)
    OS="darwin"
    ARHIVE_SHA256="5a7695f505e582fbda856f43c258accdc88051c516c2c008df73a24d4948794f"
    ;;
  Linux)
    OS="linux"
    ARHIVE_SHA256="bc2120402ffc6d01c81364c42d3f75595dfbe06e39a35f8522212c72afb2d1cf"
    ;;
  *)
    echo "Unsupported OS: $OS_UNAME" >&2
    exit 1
    ;;
esac

echo "Detected OS: $OS, ARHIVE_SHA256: $ARHIVE_SHA256"


VERSION="v20250915.1"
ASSET="eth-staking-smith_${VERSION}_${OS}_amd64.tar.gz"
REPO="ChorusOne/eth-staking-smith"
URL="https://github.com/${REPO}/releases/download/${VERSION}/${ASSET}"
OUT_DIR="./keys-generator-bin"

echo "⬇️  Downloading eth-staking-smith ${VERSION} from GitHub..."
mkdir -p "${OUT_DIR}"
cd "${OUT_DIR}"

curl -fL "${URL}" -o "${ASSET}" || {
  echo "❌ Failed to download ${URL}"
  exit 1
}

ARCHIVE_ACTUAL=$(sha256sum "$ASSET" | awk '{print $1}')

if [ "$ARCHIVE_ACTUAL" = "$ARHIVE_SHA256" ]; then
  echo "✅ Checksum for archive OK"
else
  echo "❌ Checksum for archive mismatch!"
  echo "Expected: $ARHIVE_SHA256"
  echo "Actual:   $ARCHIVE_ACTUAL"
  exit 1
fi

echo "📦 Extracting ${ASSET}..."
tar -xzf "${ASSET}"

BIN=$(tar -tzf "${ASSET}" | grep -E 'eth-staking-smith$' || true)


if [ -z "$BIN" ]; then
  echo "⚠️  Binary not found in archive. Listing contents:"
  tar -tzf "${ASSET}"
else
  echo "✅ Binary extracted: ${OUT_DIR}/${BIN}"
fi
