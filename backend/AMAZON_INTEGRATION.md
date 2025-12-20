# Amazon Product Advertising API Integration

This document explains how to set up and use the Amazon PA-API integration for Coobifl.

## Prerequisites

1. **Amazon Associates Account**
   - Sign up at: https://affiliate-program.amazon.com/
   - Complete the application process
   - Get approved (may take 1-3 business days)

2. **Product Advertising API Access**
   - Once approved for Associates, request PA-API access
   - Application: https://webservices.amazon.com/paapi5/documentation/
   - You'll receive:
     - Access Key
     - Secret Key
     - Associate Tag (Partner Tag)

## Configuration

### 1. Add Credentials to .env

Copy `.env.example` to `.env` and add your credentials:

```env
AMAZON_ACCESS_KEY=your_actual_access_key
AMAZON_SECRET_KEY=your_actual_secret_key
AMAZON_PARTNER_TAG=your_actual_partner_tag
AMAZON_REGION=us-east-1
AMAZON_MARKETPLACE=www.amazon.com
ENABLE_AUTO_SYNC=false
```

### 2. Install Dependencies

```bash
npm install
```

This will install `node-cron` and `axios` which are required for the Amazon integration.

## API Endpoints

### Get Sync Status

```bash
GET /api/sync/status
```

Returns current sync status, scheduler info, and configuration status.

### Manual Sync Operations

#### 1. Full Sync (All Categories)

```bash
POST /api/sync/full
```

Syncs products from all configured categories. This may take several minutes.

#### 2. Incremental Sync (Update Existing)

```bash
POST /api/sync/incremental
```

Updates existing Amazon products with latest data.

#### 3. Sync by Keywords

```bash
POST /api/sync/keywords
Content-Type: application/json

{
  "keywords": "garlic press",
  "itemCount": 10
}
```

Searches Amazon for specific keywords and imports products.

#### 4. Sync by Category

```bash
POST /api/sync/category
Content-Type: application/json

{
  "category": "HomeAndKitchen",
  "itemCount": 10
}
```

Imports products from a specific Amazon category.

**Available Categories:**
- HomeAndKitchen
- Tools
- Electronics
- Sports
- AutomotiveParts

#### 5. Update by ASINs

```bash
POST /api/sync/update-asins
Content-Type: application/json

{
  "asins": ["B0001WVH3I", "B00HHLNRVE"]
}
```

Updates specific products by their Amazon Standard Identification Numbers (ASINs).

## Automated Syncs

Enable automatic scheduled syncs by setting in `.env`:

```env
ENABLE_AUTO_SYNC=true
```

### Default Schedules

- **Full Sync**: Daily at 2:00 AM (Eastern Time)
  - Syncs all configured categories
  - Updates product catalog

- **Incremental Sync**: Every 6 hours
  - Updates existing Amazon products
  - Keeps prices and availability current

### Customizing Schedules

Edit `backend/src/config/amazon.js`:

```javascript
syncIntervals: {
  full: '0 2 * * *',         // Cron: Daily at 2 AM
  incremental: '0 */6 * * *' // Cron: Every 6 hours
}
```

[Cron Format Reference](https://crontab.guru/)

## Rate Limiting

Amazon PA-API has strict rate limits:

- **Free Tier**: 1 request per second, 8,640 requests per day
- **Paid Tier**: Higher limits based on sales

The integration automatically enforces rate limits to prevent API errors.

## Data Preservation

When syncing Amazon products, the integration:

✅ **Preserves** crowd-sourced data:
- Country of Origin
- Materials Used
- Sticker Location
- Manufacturing Notes
- Upvotes/Downvotes
- Reports

✅ **Updates** Amazon data:
- Title, description, features
- Price and availability
- Images
- Ratings and reviews

## Example Workflow

### First-Time Setup

1. Get API credentials from Amazon
2. Add to `.env` file
3. Restart backend server
4. Trigger initial sync:

```bash
# Sync kitchen products
curl -X POST http://localhost:5000/api/sync/category \
  -H "Content-Type: application/json" \
  -d '{"category": "HomeAndKitchen", "itemCount": 50}'

# Or sync by keywords
curl -X POST http://localhost:5000/api/sync/keywords \
  -H "Content-Type: application/json" \
  -d '{"keywords": "stainless steel kitchen tools", "itemCount": 30}'
```

5. Check products in database:

```bash
curl http://localhost:5000/api/products?source=amazon_pa_api
```

### Regular Maintenance

- Enable automated syncs (`ENABLE_AUTO_SYNC=true`)
- Monitor sync status via `/api/sync/status`
- Review logs for errors
- Adjust sync frequency based on needs

## Troubleshooting

### Error: "Amazon PA-API not configured"

Solution: Add valid credentials to `.env` file and restart server.

### Error: "Too Many Requests" (429)

Solution: Rate limit exceeded. Wait 1 second between requests. The integration handles this automatically.

### Error: "Invalid Signature"

Solution: Check that:
- Access Key and Secret Key are correct
- No extra spaces in `.env` file
- Secret Key hasn't expired

### Products Not Syncing

Check:
1. Amazon Associates account is approved
2. PA-API access is granted
3. Credentials are correct in `.env`
4. Server logs for specific errors
5. MongoDB connection is working

## Cost Considerations

- Amazon Associates program is **free**
- PA-API access is **free** with limits
- No charges unless you upgrade to paid tier
- Must maintain minimum sales to keep API access (check Amazon's current requirements)

## Best Practices

1. **Start Small**: Sync one category first to test
2. **Monitor Quota**: Track daily request count
3. **Preserve Community Data**: Never overwrite crowd-sourced specs
4. **Schedule Wisely**: Run full syncs during low-traffic hours
5. **Handle Errors**: Log failures and retry later
6. **Update Regularly**: Keep products fresh with incremental syncs

## Support

- Amazon PA-API Documentation: https://webservices.amazon.com/paapi5/documentation/
- Amazon Associates Support: https://affiliate-program.amazon.com/help
- Coobifl Issues: Create an issue in the project repository
