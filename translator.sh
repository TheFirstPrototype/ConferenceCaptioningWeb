#!/bin/bash

# JSON file containing translations
TRANSLATION_FILE="translations.json"
# Define the language codes
languageCodes=("ES" "FR" "PT" "AR" "RU" "DE" "UK" "HI" "UR" "YO" "ID" "IT" "JA" "SW" "PL" "VI" "RO" "zh-Hant" "ZH" "HR" "FA" "NL" "KO" "SV" "HU" "SQ")

# Check if translation file exists
if [ ! -f "$TRANSLATION_FILE" ]; then
    echo "Translation file '$TRANSLATION_FILE' not found."
    exit 1
fi

# Create a temporary file to store JSON data
tmp_file=$(mktemp)

# Extract translations to temporary file
jq -c ".[]" "$TRANSLATION_FILE" > "$tmp_file"

# Function to escape special characters for sed
escape_sed() {
    echo "$1" | gsed -e 's/[\/&]/\\&/g' -e 's/(/\\(/g' -e 's/)/\\)/g'
}

# Iterate through each language and perform translations
for lang in "${languageCodes[@]}"; do
    lowerCode=$(echo "$lang" | tr '[:upper:]' '[:lower:]')
    html_file=index-${lowerCode}.html
    if [ ! -f "$html_file" ]; then
        echo "HTML file '$html_file' for language '$lang' not found."
    else
        echo "Applying translations for language '$lang' to HTML file '$html_file'..."

        # Generate sed commands for current language
        sed_commands=""
        while IFS= read -r line; do
            en_value=$(echo "$line" | jq -r '.EN // empty')
            echo $en_value
            lang_value=$(echo "$line" | jq -r ".$lang // empty")
            echo $lang_value

            if [ -n "$en_value" ] && [ -n "$lang_value" ]; then
                escaped_en_value=$(escape_sed "$en_value")
                escaped_lang_value=$(escape_sed "$lang_value")
                echo $escaped_en_value
                echo $escaped_lang_value
                # Use different delimiter in sed command to avoid issues with special characters
                sed_commands+="s#${escaped_en_value}#${escaped_lang_value}#g;"
            fi
        done < "$tmp_file"

        # Perform sed replacement on the HTML file
        gsed -i.bak -e "$sed_commands" "$html_file"
        echo "Translations applied for language '$lang'."
    fi
done

echo "All translations applied successfully."
