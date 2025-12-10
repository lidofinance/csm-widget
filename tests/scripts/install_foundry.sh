#!/usr/bin/env bash
set -euo pipefail

FOUNDRY_VERSION='v1.2.3'

# Create temporary directory
TMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TMP_DIR"

# Cleanup temporary directory on exit
trap "rm -rf $TMP_DIR" EXIT

# Clone Foundry at specific version
echo "Cloning Foundry repository at tag/version: $FOUNDRY_VERSION"
git clone --branch "$FOUNDRY_VERSION" --depth 1 https://github.com/foundry-rs/foundry.git "$TMP_DIR/foundry"

# Run Foundry's own install script
echo "Running Foundry install script"
chmod +x "$TMP_DIR/foundry/foundryup/install"
"$TMP_DIR/foundry/foundryup/install"

# Explicitly install desired Foundry version using foundryup
echo "Installing Foundry version: $FOUNDRY_VERSION"
chmod +x "$TMP_DIR/foundry/foundryup/foundryup"
"$TMP_DIR/foundry/foundryup/foundryup" --install "$FOUNDRY_VERSION"

# Determine Foundry installation directory
BASE_DIR="${XDG_CONFIG_HOME:-$HOME}"
FOUNDRY_DIR="${FOUNDRY_DIR:-"$BASE_DIR/.foundry"}"
FOUNDRY_BIN_DIR="$FOUNDRY_DIR/bin"

echo "Foundry bin directory: $FOUNDRY_BIN_DIR"

echo "Symlinking Foundry binaries to /usr/local/bin"
for bin in "$FOUNDRY_BIN_DIR"/*; do
  sudo ln -sf "$bin" /usr/local/bin/$(basename "$bin")
done

# Verify the installation explicitly in the current session
if command -v forge &> /dev/null && command -v cast &> /dev/null; then
    echo "Foundry installation verified successfully!"
    forge --version
    cast --version
else
    echo "Foundry installation failed!" >&2
    exit 1
fi
