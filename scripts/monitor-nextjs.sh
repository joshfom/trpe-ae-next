#!/bin/bash

# Next.js Process Monitor Script
# Use: ./monitor-nextjs.sh

echo "🔍 Monitoring Next.js processes..."

while true; do
    # Count Next.js worker processes
    WORKER_COUNT=$(ps aux | grep -c "jest-worker/processChild.js" | grep -v grep || echo "0")
    
    # Check if there are too many workers
    if [ "$WORKER_COUNT" -gt 8 ]; then
        echo "⚠️  WARNING: $WORKER_COUNT worker processes detected! Killing runaway processes..."
        pkill -f "jest-worker/processChild.js"
        echo "✅ Killed runaway worker processes"
    fi
    
    # Check CPU usage of Next.js processes
    NEXT_CPU=$(ps aux | grep "next-server" | awk '{sum += $3} END {print sum}' || echo "0")
    
    if (( $(echo "$NEXT_CPU > 100" | bc -l) )); then
        echo "⚠️  HIGH CPU: Next.js using ${NEXT_CPU}% CPU"
    fi
    
    # Show current status
    echo "$(date): Workers: $WORKER_COUNT, CPU: ${NEXT_CPU}%"
    
    # Wait 30 seconds before next check
    sleep 30
done
