#!/bin/bash

# Test admin login
echo "Testing admin login..."

curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=admin@eva.com&password=YourPassword123" \
  -v

echo ""
echo "Done"
