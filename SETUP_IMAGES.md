# How to Add Real Garlic Press Images

## Step 1: Download Images

Go to these free stock photo sites and download 16 garlic press images:

### Recommended Sites:
1. **Pexels**: https://www.pexels.com/search/garlic%20press/
   - Click "Free Download"
   - Choose "Medium" size (around 800px)

2. **Pixabay**: https://pixabay.com/images/search/garlic%20press/
   - Click image → "Free Download" → Select medium size

3. **Unsplash**: https://unsplash.com/s/photos/kitchen-utensils
   - Search for "garlic press" or "kitchen utensils"
   - Click "Download free" → Medium size

### Tips:
- Download **16 images** (one for each product)
- Look for clear, professional photos with white/neutral backgrounds
- Avoid watermarked images

## Step 2: Rename Images

Rename your downloaded images to:
```
garlic-press-1.jpg
garlic-press-2.jpg
garlic-press-3.jpg
...
garlic-press-16.jpg
```

**Windows Quick Rename**:
1. Select all images in folder
2. Right-click first image → Rename → Type "garlic-press"
3. Windows will auto-number them

## Step 3: Move Images to Project

Copy all 16 images to:
```
C:\Users\imman\Coobifl\frontend\public\images\products\
```

## Step 4: Commit and Deploy

```bash
cd C:\Users\imman\Coobifl
git add frontend/public/images/products/
git commit -m "Add real garlic press product images"
git push origin main
```

Wait 30-40 seconds for Vercel to deploy.

## Step 5: Update Database

Run this command to update all products to use the new images:

```bash
curl -X POST https://coobifl-production.up.railway.app/api/update-local-images
```

## Step 6: Verify

Visit your website:
```
https://ross.coobifl.com/search?q=garlic
```

You should now see real garlic press images instead of placeholders!

## Image Specifications

- **Format**: JPG (preferred) or PNG
- **Recommended size**: 800x800px
- **Max file size**: 200KB per image (for fast loading)
- **Naming pattern**: garlic-press-{number}.jpg

## Alternative: Optimize Images

If images are too large, use this free tool to compress them:
- **TinyPNG**: https://tinypng.com/ (drag & drop, download compressed)

## Troubleshooting

**Images not showing?**
1. Make sure images are in `frontend/public/images/products/`
2. Check filenames match exactly: `garlic-press-1.jpg` (lowercase, with dash)
3. Run `git push` to deploy to Vercel
4. Run `/api/update-local-images` endpoint again
5. Clear browser cache (Ctrl+F5)

**Images too big?**
- Compress at https://tinypng.com/
- Or resize to 800x800px before uploading
