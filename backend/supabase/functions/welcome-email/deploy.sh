#!/bin/bash

# Welcome Email Edge Function Deployment Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying Welcome Email Edge Function${NC}"

# Check if project ref is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Project reference is required${NC}"
    echo "Usage: ./deploy.sh <project-ref>"
    echo "Example: ./deploy.sh abcdefghijklmnop"
    exit 1
fi

PROJECT_REF=$1

echo -e "${YELLOW}📋 Project Reference: ${PROJECT_REF}${NC}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Error: Supabase CLI is not installed${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "index.ts" ]; then
    echo -e "${RED}❌ Error: index.ts not found in current directory${NC}"
    echo "Make sure you're in the welcome-email function directory"
    exit 1
fi

echo -e "${YELLOW}🔧 Deploying function...${NC}"

# Deploy the function
npx supabase functions deploy welcome-email --project-ref $PROJECT_REF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Function deployed successfully!${NC}"
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Set environment variables in your Supabase dashboard:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - SENDGRID_API_KEY"
    echo "2. Update the SendGrid template ID in index.ts"
    echo "3. Create the database trigger (see README.md)"
    echo "4. Test by creating a new user"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi 