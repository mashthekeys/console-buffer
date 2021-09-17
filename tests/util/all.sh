#!/usr/bin/env bash

for f in tests/*.js; do
    if node "$f" 1>/dev/null 2>&1
    then
        echo "$f: PASS"
    else
        echo "$f: FAIL"
        echo
        node "$f"
        exit 1
    fi
done

echo 'ALL PASSED'
echo
exit 0