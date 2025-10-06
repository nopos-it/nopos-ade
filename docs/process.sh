#!/bin/bash
# Download ADE PDFs and convert to markdown

set -e
cd "$(dirname "$0")"

mkdir -p pdf md

echo "📚 Processing ADE Documentation"
echo ""

# Check pdftotext
if ! command -v pdftotext &> /dev/null; then
    echo "⚠️  pdftotext not found. Install: brew install poppler"
    echo "   Continuing with download only..."
    CONVERT=false
else
    CONVERT=true
fi

# Process each URL
while IFS= read -r url || [ -n "$url" ]; do
    [[ -z "$url" || "$url" =~ ^#.* ]] && continue
    
    filename=$(basename "$url")
    echo "→ $filename"
    
    # Download
    if curl -fsSL -o "pdf/$filename" "$url"; then
        echo "  ✅ Downloaded"
        
        # Convert to markdown
        if [ "$CONVERT" = true ]; then
            md_file="md/${filename%.pdf}.md"
            if pdftotext -layout "pdf/$filename" "$md_file" 2>/dev/null; then
                echo "  ✅ Converted"
            fi
        fi
    else
        echo "  ❌ Failed"
    fi
done < urls.txt

echo ""
echo "✅ Done!"
echo "📁 PDFs: $(ls pdf/*.pdf 2>/dev/null | wc -l | xargs) files in pdf/"
[ "$CONVERT" = true ] && echo "📄 Markdown: $(ls md/*.md 2>/dev/null | wc -l | xargs) files in md/"

