#!/bin/bash

# Batch enhancement script for remaining calculator JSON files
# This script helps track which calculators have been enhanced

echo "Calculator JSON Enhancement Progress"
echo "===================================="
echo ""

CALC_DIR="app/calculators"

# List of calculator files to enhance
declare -a CALCULATORS=(
    "scientific/scientific.json"
    "graphing/graphing.json"
    "loan/loan.json"
    "tip/tip.json"
    "percentage/percentage.json"
    "date-calculator/date-calculator.json"
    "calorie/calorie.json"
    "protein/protein.json"
    "pregnancy/pregnancy.json"
    "paint/paint.json"
    "flooring/flooring.json"
    "concrete/concrete.json"
)

# Check each file
for calc in "${CALCULATORS[@]}"; do
    file="$CALC_DIR/$calc"
    if [ -f "$file" ]; then
        # Count words in sections
        words=$(node scripts/count-content-words.js 2>/dev/null | grep "$(basename ${calc%.json})" | awk '{print $2}')

        if [ ! -z "$words" ]; then
            if [ "$words" -ge 500 ]; then
                echo "✅ $calc - $words words"
            else
                echo "❌ $calc - $words words (need $((500 - words)) more)"
            fi
        else
            echo "⚠️  $calc - unable to count"
        fi
    else
        echo "❌ $calc - file not found"
    fi
done

echo ""
echo "Run: node scripts/count-content-words.js --under-500"
echo "to see detailed word counts for files under 500 words"
