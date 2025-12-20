# Product Image Sources

## Current Setup

All 32 products now use **real Amazon product images** via the Amazon Associates Widget system.

### Image URLs

The images are loaded using Amazon's widget service:
```
https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={ASIN}&Format=_SL{SIZE}_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1
```

**Benefits:**
- ✅ No API key required
- ✅ Real Amazon product images
- ✅ Automatically uses the correct product image for each ASIN
- ✅ Multiple sizes available (300px, 400px, 500px)
- ✅ Works with Amazon Associates program

## How Images Were Updated

Images were updated using the `/api/update-images` endpoint:

```bash
curl -X POST https://coobifl-production.up.railway.app/api/update-images
```

This automatically updated all 32 products with their corresponding Amazon images.

## Alternative Image Sources (For Future Use)

### Free Stock Photos (No Amazon product required)

1. **[Unsplash](https://unsplash.com/s/photos/kitchen-utensils)** - 100% free, no attribution required
   - 50,000+ kitchen utensils photos
   - Commercial use allowed
   - High quality images

2. **[Pexels](https://www.pexels.com/search/kitchen%20utensils/)** - Free for commercial use
   - 100,000+ kitchen stock photos
   - No attribution needed
   - Thousands added daily

3. **[Vecteezy](https://www.vecteezy.com/free-photos/garlic-press)** - Free downloads available
   - Garlic press specific images
   - Royalty-free options

### Paid Stock Photo Sites (Higher quality, more options)

1. **[Shutterstock](https://www.shutterstock.com/search/garlic-press)** - 10,639+ garlic press images
2. **[iStock](https://www.istockphoto.com/photos/garlic-press)** - 1,600+ royalty-free images
3. **[Dreamstime](https://www.dreamstime.com/photos-images/garlic-presser.html)** - Royalty-free stock images

## Amazon Product Advertising API (For Future Enhancement)

When you get approved for Amazon Associates and want even better integration:

1. **Sign up**: [Amazon Product Advertising API](https://affiliate-program.amazon.com/help/operating/api)
2. **Get credentials**: Access Key, Secret Key, Partner Tag
3. **Use the API**: Fetch real product data including:
   - High-resolution images
   - Current prices
   - Product descriptions
   - Customer reviews
   - Availability status

Add to `.env.production`:
```bash
AMAZON_ACCESS_KEY=your_access_key
AMAZON_SECRET_KEY=your_secret_key
AMAZON_PARTNER_TAG=your_partner_tag
```

## Image Update Utilities

Three utility scripts are available in `backend/src/utils/`:

1. **updateToAmazonWidgetImages.js** - Update to Amazon widget URLs (currently in use)
2. **updateProductImages.js** - Update to Unsplash placeholder images
3. **fetchAmazonImages.js** - Instructions for getting Amazon images

## Testing Images

To test if an Amazon widget image works, open this URL in your browser:
```
https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00HHLNRVE&Format=_SL500_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1
```

Replace `B00HHLNRVE` with any product ASIN to see its image.
