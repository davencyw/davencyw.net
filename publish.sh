#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Publishing website to GitHub Pages...${NC}"

# Navigate to the page directory
cd page

echo -e "${BLUE}📦 Building website...${NC}"
# Build the website
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${BLUE}🌐 Deploying to GitHub Pages...${NC}"
# Deploy to GitHub Pages
if npm run deploy; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🎉 Your website is now live at: https://davencyw.github.io/davencyw.net/${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎊 All done! Your website has been published.${NC}" 