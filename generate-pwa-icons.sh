#!/bin/bash

# PWA Icon Generation Script for TRPE Global
# This script generates all required PWA icons from a source image

echo "🎨 PWA Icon Generation for TRPE Global"
echo "========================================="

# Check if we have the required tools
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick 'convert' not found. Please install ImageMagick:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu: sudo apt-get install imagemagick"
    echo "   Windows: Download from https://imagemagick.org/script/download.php"
    exit 1
fi

# Create icons directory if it doesn't exist
mkdir -p public/icons

# You'll need to provide a high-resolution source image (512x512 or larger)
# For now, we'll create placeholder icons
SOURCE_IMAGE="public/trpe-logo.webp"

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "⚠️  Source image not found: $SOURCE_IMAGE"
    echo "📝 Creating placeholder icons..."
    
    # Create a simple placeholder icon using ImageMagick
    convert -size 512x512 xc:"#2563eb" \
            -fill white \
            -pointsize 120 \
            -gravity center \
            -annotate +0+0 "TRPE" \
            temp_logo.png
    
    SOURCE_IMAGE="temp_logo.png"
fi

echo "📱 Generating PWA icons from: $SOURCE_IMAGE"

# PWA Standard Icons
convert "$SOURCE_IMAGE" -resize 192x192 public/icons/icon-192x192.png
convert "$SOURCE_IMAGE" -resize 512x512 public/icons/icon-512x512.png

# Apple Touch Icons
convert "$SOURCE_IMAGE" -resize 180x180 public/icons/apple-touch-icon.png
convert "$SOURCE_IMAGE" -resize 180x180 public/icons/apple-touch-icon-180x180.png
convert "$SOURCE_IMAGE" -resize 152x152 public/icons/apple-touch-icon-152x152.png
convert "$SOURCE_IMAGE" -resize 167x167 public/icons/apple-touch-icon-167x167.png

# Favicons
convert "$SOURCE_IMAGE" -resize 32x32 public/icons/favicon-32x32.png
convert "$SOURCE_IMAGE" -resize 16x16 public/icons/favicon-16x16.png

# Microsoft Tiles
convert "$SOURCE_IMAGE" -resize 70x70 public/icons/ms-icon-70x70.png
convert "$SOURCE_IMAGE" -resize 150x150 public/icons/ms-icon-150x150.png
convert "$SOURCE_IMAGE" -resize 310x310 public/icons/ms-icon-310x310.png

# PWA Badge Icon (monochrome)
convert "$SOURCE_IMAGE" -resize 72x72 -colorspace Gray public/icons/badge-72x72.png

# PWA Maskable Icon (with safe zone)
convert "$SOURCE_IMAGE" -resize 400x400 -background "#2563eb" -gravity center -extent 512x512 public/icons/maskable-icon-512x512.png

# Shortcut Icons
convert "$SOURCE_IMAGE" -resize 96x96 public/icons/shortcut-properties-96x96.png
convert "$SOURCE_IMAGE" -resize 96x96 public/icons/shortcut-luxe-96x96.png
convert "$SOURCE_IMAGE" -resize 96x96 public/icons/shortcut-search-96x96.png

# Clean up temp file if we created one
if [ -f "temp_logo.png" ]; then
    rm temp_logo.png
fi

echo "✅ Icon generation complete!"
echo ""
echo "📊 Generated icons:"
echo "   • PWA: icon-192x192.png, icon-512x512.png"
echo "   • Apple: apple-touch-icon variants"
echo "   • Favicon: favicon-32x32.png, favicon-16x16.png"
echo "   • Microsoft: ms-icon variants"
echo "   • Special: badge, maskable, shortcut icons"
echo ""
echo "🚀 Your PWA is ready to install!"
echo ""
echo "📱 To test PWA installation:"
echo "   1. Run: npm run dev"
echo "   2. Open Chrome DevTools → Application → Manifest"
echo "   3. Click 'Install' or use the address bar install prompt"
