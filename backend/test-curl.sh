#!/bin/bash

# Test script for Zerrah Signup API using curl

API_BASE_URL="http://localhost:3000/api"

echo "🧪 Testing Zerrah Signup API with curl commands...\n"

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
curl -s "${API_BASE_URL}/health" | jq .
echo "\n"

# Test 2: User signup
echo "2️⃣ Testing user signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/users/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl-test@example.com",
    "firstName": "Curl",
    "age": "20-25",
    "gender": "Non-binary",
    "profession": "IT & Software Development",
    "country": "United Kingdom",
    "city": "London",
    "household": "1 person",
    "ctaVariant": "A"
  }')

echo "$SIGNUP_RESPONSE" | jq .

# Extract user ID from response
USER_ID=$(echo "$SIGNUP_RESPONSE" | jq -r '.user.id')

echo "\n3️⃣ Testing community join..."
JOIN_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/users/join-community" \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\"}")

echo "$JOIN_RESPONSE" | jq .

echo "\n4️⃣ Testing user activities..."
ACTIVITIES_RESPONSE=$(curl -s "${API_BASE_URL}/users/${USER_ID}/activities")
echo "$ACTIVITIES_RESPONSE" | jq .

echo "\n5️⃣ Testing user count..."
COUNT_RESPONSE=$(curl -s "${API_BASE_URL}/users/admin/count")
echo "$COUNT_RESPONSE" | jq .

echo "\n✅ All curl tests completed!" 