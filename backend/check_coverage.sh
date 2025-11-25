#!/bin/bash

# Path to the JaCoCo CSV report
REPORT_FILE="target/site/jacoco/jacoco.csv"

# Check if report exists, if not, run tests
if [ ! -f "$REPORT_FILE" ]; then
    echo "Coverage report not found. Running tests..."
    ./mvnw test
fi

echo ""
echo "======================================================================"
printf "%-50s %10s\n" "CLASS" "COVERAGE"
echo "======================================================================"

# Parse CSV using awk
# Columns: 3=Class, 4=Instruction_Missed, 5=Instruction_Covered
awk -F, 'NR>1 {
    missed = $4
    covered = $5
    total = missed + covered
    
    if (total > 0) {
        pct = (covered / total) * 100
    } else {
        pct = 0
    }

    # Accumulate totals for cumulative average
    grand_missed += missed
    grand_covered += covered

    # Print individual file coverage
    printf "%-50s %9.1f%%\n", $3, pct
}' "$REPORT_FILE" | sort -k2 -n  # Sort by coverage percentage (ascending)

# Calculate and print total coverage separately to ensure it appears at the bottom
awk -F, 'NR>1 {
    grand_missed += $4
    grand_covered += $5
}
END {
    grand_total = grand_missed + grand_covered
    if (grand_total > 0) {
        grand_pct = (grand_covered / grand_total) * 100
    } else {
        grand_pct = 0
    }
    print "======================================================================"
    printf "%-50s %9.1f%%\n", "TOTAL BACKEND COVERAGE", grand_pct
    print "======================================================================"
}' "$REPORT_FILE"
