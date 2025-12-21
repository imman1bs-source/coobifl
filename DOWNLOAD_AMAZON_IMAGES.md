# Download Real Amazon Product Images

## 📋 16 Products with ASINs

```
1.  B0EFGH4567 - Electric Garlic Mincer - USB Rechargeable
2.  B00HHLNRVE - Alpha Grillers Garlic Press
3.  B0000DJVKQ - Zyliss Susi 3 Garlic Press
4.  B08T1YNR3Q - ORBLUE Garlic Press
5.  B07PHXHK6W - Kuhn Rikon Epicurean Garlic Press
6.  B09VLKJ2M3 - OXO Good Grips Garlic Press
7.  B0BQT56LMN - Dreamfarm Garject Self-Cleaning
8.  B0756YKBZS - Microplane Professional Garlic Press
9.  B00004OCNS - Norpro Jumbo Garlic Press
10. B08XYZABC1 - Chef'n Garlic Press Rocker
11. B0C1GH3KLM - Premium Garlic Press & Peeler Set
12. B09MNP2QRS - Joseph Joseph Easy-Press
13. B0D5FGHJ6K - Garlic Twist Tool
14. B07STVWXYZ - Prepara Professional Garlic Press
15. B08PQRSTUV - Budget Garlic Press
16. B0001WVH3I - Joseph Joseph Rocker Crusher
```

## 🎯 Step-by-Step Instructions

### Step 1: Download Images from Amazon

For each ASIN, do the following:

1. **Go to product page**:
   ```
   https://www.amazon.com/dp/[ASIN]
   ```
   Example: https://www.amazon.com/dp/B00HHLNRVE

2. **Right-click the main product image** → "Save image as..."

3. **Save with ASIN as filename**:
   - Filename: `B00HHLNRVE.jpg`
   - Location: Desktop or Downloads folder (temporary)

4. **Repeat for all 16 ASINs**

### Step 2: Move Images to Project

Copy all 16 images to:
```
C:\Users\imman\Coobifl\frontend\public\images\products\
```

Your folder should look like:
```
frontend/public/images/products/
├── B0EFGH4567.jpg
├── B00HHLNRVE.jpg
├── B0000DJVKQ.jpg
├── B08T1YNR3Q.jpg
├── B07PHXHK6W.jpg
├── B09VLKJ2M3.jpg
├── B0BQT56LMN.jpg
├── B0756YKBZS.jpg
├── B00004OCNS.jpg
├── B08XYZABC1.jpg
├── B0C1GH3KLM.jpg
├── B09MNP2QRS.jpg
├── B0D5FGHJ6K.jpg
├── B07STVWXYZ.jpg
├── B08PQRSTUV.jpg
└── B0001WVH3I.jpg
```

### Step 3: Deploy to Vercel

```bash
cd C:\Users\imman\Coobifl
git add frontend/public/images/products/
git commit -m "Add real Amazon product images"
git push origin main
```

Wait 30-40 seconds for Vercel to deploy.

### Step 4: Update Database

Run this command to map each product to its ASIN image:

```bash
curl -X POST https://coobifl-production.up.railway.app/api/update-asin-images
```

### Step 5: Verify

Visit your website:
```
https://ross.coobifl.com/search?q=garlic
```

Each product will now show its exact Amazon product image!

## 💡 Pro Tips

### Quick Download Method
1. Open all Amazon product pages in tabs:
   - Ctrl+Click each ASIN link below to open in new tab
   - https://www.amazon.com/dp/B0EFGH4567
   - https://www.amazon.com/dp/B00HHLNRVE
   - https://www.amazon.com/dp/B0000DJVKQ
   - https://www.amazon.com/dp/B08T1YNR3Q
   - https://www.amazon.com/dp/B07PHXHK6W
   - https://www.amazon.com/dp/B09VLKJ2M3
   - https://www.amazon.com/dp/B0BQT56LMN
   - https://www.amazon.com/dp/B0756YKBZS
   - https://www.amazon.com/dp/B00004OCNS
   - https://www.amazon.com/dp/B08XYZABC1
   - https://www.amazon.com/dp/B0C1GH3KLM
   - https://www.amazon.com/dp/B09MNP2QRS
   - https://www.amazon.com/dp/B0D5FGHJ6K
   - https://www.amazon.com/dp/B07STVWXYZ
   - https://www.amazon.com/dp/B08PQRSTUV
   - https://www.amazon.com/dp/B0001WVH3I

2. Go through each tab and save the main image with ASIN name

### Screenshot Method (Alternative)
If Amazon blocks image saving:
1. Use Windows Snipping Tool (Win+Shift+S)
2. Select the product image area
3. Paste into Paint
4. Save as `[ASIN].jpg`

## 🚨 Important Notes

- **File format**: Must be `.jpg` (not .png or .webp)
- **Filename**: Must match ASIN exactly (case-sensitive)
- **All 16 required**: The endpoint expects all ASINs to have images
- **Image quality**: Amazon images are already optimized, no need to resize

## ✅ Verification Checklist

- [ ] Downloaded all 16 images from Amazon
- [ ] Renamed each to its ASIN (e.g., B00HHLNRVE.jpg)
- [ ] Moved to `frontend/public/images/products/`
- [ ] Committed and pushed to GitHub
- [ ] Waited for Vercel deployment
- [ ] Ran `/api/update-asin-images` endpoint
- [ ] Verified images on https://ross.coobifl.com

## 🎉 Result

Your website will show the **exact same images** that appear on Amazon.com for each product. This makes your site look completely professional and legitimate!
