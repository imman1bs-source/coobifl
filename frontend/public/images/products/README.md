# Product Images

## How to Add Real Product Images

1. Download 16-20 garlic press images from free stock photo sites
2. Save them as: `garlic-press-1.jpg`, `garlic-press-2.jpg`, etc.
3. Put them in this folder (`frontend/public/images/products/`)
4. Update the database using the endpoint: `POST /api/update-local-images`

## Recommended Sources for Free Images

- **Pexels**: https://www.pexels.com/search/garlic%20press/
- **Unsplash**: https://unsplash.com/s/photos/garlic
- **Pixabay**: https://pixabay.com/images/search/garlic%20press/
- **Burst by Shopify**: https://burst.shopify.com/

## Image Specifications

- **Format**: JPG (recommended) or PNG
- **Size**: 800x800px or similar square/rectangular ratio
- **File size**: Keep under 200KB each for fast loading
- **Naming**: garlic-press-1.jpg through garlic-press-16.jpg

## After Adding Images

Run this command to update the database:
```bash
curl -X POST https://coobifl-production.up.railway.app/api/update-local-images
```

Or visit your deployed site and the images will automatically load from:
```
https://ross.coobifl.com/images/products/garlic-press-1.jpg
```
