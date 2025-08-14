# Laravel Backend Setup for AJAX Shop Filtering

This document shows you how to set up the Laravel backend to work with the AJAX shop filtering frontend.

## 1. API Routes

Add these routes to your `routes/api.php`:

```php
<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/filter', [ProductController::class, 'filter']);
    Route::get('/search', [ProductController::class, 'search']);
});
```

## 2. Product Controller

Create `app/Http/Controllers/Api/ProductController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Get all products with pagination
     */
    public function index(Request $request): JsonResponse
    {
        $products = Product::with(['category', 'brand'])
            ->paginate($request->get('per_page', 9));

        return response()->json($products);
    }

    /**
     * Filter products based on criteria
     */
    public function filter(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand']);

        // Price filter
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Color filter
        if ($request->has('colors')) {
            $colors = $request->colors;
            if (is_array($colors)) {
                $query->whereHas('colors', function ($q) use ($colors) {
                    $q->whereIn('name', $colors);
                });
            }
        }

        // Size filter
        if ($request->has('sizes')) {
            $sizes = $request->sizes;
            if (is_array($sizes)) {
                $query->whereHas('sizes', function ($q) use ($sizes) {
                    $q->whereIn('name', $sizes);
                });
            }
        }

        // Brand filter
        if ($request->has('brands')) {
            $brands = $request->brands;
            if (is_array($brands)) {
                $query->whereIn('brand_id', $brands);
            }
        }

        // Sale filter
        if ($request->has('on_sale') && $request->on_sale == '1') {
            $query->where('on_sale', true);
        }

        // Stock filter
        if ($request->has('in_stock') && $request->in_stock == '1') {
            $query->where('stock_quantity', '>', 0);
        }

        // Pagination
        $perPage = $request->get('per_page', 9);
        $products = $query->paginate($perPage);

        return response()->json([
            'data' => $products->items(),
            'total' => $products->total(),
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
        ]);
    }

    /**
     * Search products by name or description
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'data' => [],
                'total' => 0
            ]);
        }

        $products = Product::with(['category', 'brand'])
            ->where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->paginate($request->get('per_page', 9));

        return response()->json([
            'data' => $products->items(),
            'total' => $products->total(),
        ]);
    }
}
```

## 3. Product Model

Update your `app/Models/Product.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'old_price',
        'category_id',
        'brand_id',
        'stock_quantity',
        'on_sale',
        'is_new',
        'is_hot',
        'discount_percentage',
        'rating',
        'image',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'on_sale' => 'boolean',
        'is_new' => 'boolean',
        'is_hot' => 'boolean',
        'rating' => 'integer',
    ];

    /**
     * Get the category that owns the product
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the brand that owns the product
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the colors for the product
     */
    public function colors(): BelongsToMany
    {
        return $this->belongsToMany(Color::class);
    }

    /**
     * Get the sizes for the product
     */
    public function sizes(): BelongsToMany
    {
        return $this->belongsToMany(Size::class);
    }

    /**
     * Scope for products on sale
     */
    public function scopeOnSale($query)
    {
        return $query->where('on_sale', true);
    }

    /**
     * Scope for products in stock
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }
}
```

## 4. Database Migration

Create a migration for the products table:

```bash
php artisan make:migration create_products_table
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('old_price', 10, 2)->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('brand_id')->constrained()->onDelete('cascade');
            $table->integer('stock_quantity')->default(0);
            $table->boolean('on_sale')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_hot')->default(false);
            $table->integer('discount_percentage')->default(0);
            $table->integer('rating')->default(0);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

## 5. CSRF Token Setup

In your Blade template, add the CSRF token meta tag:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Your Shop</title>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

## 6. API Response Format

The API returns data in this format:

```json
{
    "data": [
        {
            "id": 1,
            "name": "Product Name",
            "price": "199.00",
            "old_price": null,
            "category": {
                "id": 1,
                "name": "Furniture"
            },
            "brand": {
                "id": 1,
                "name": "Brand Name"
            },
            "on_sale": false,
            "is_new": false,
            "is_hot": false,
            "discount_percentage": 0,
            "rating": 4,
            "image": "path/to/image.jpg"
        }
    ],
    "total": 14,
    "current_page": 1,
    "last_page": 2,
    "per_page": 9
}
```

## 7. Testing the API

You can test the API endpoints:

```bash
# Get all products
curl "http://your-site.com/api/products"

# Filter products
curl "http://your-site.com/api/products/filter?max_price=300&on_sale=1"

# Search products
curl "http://your-site.com/api/products/search?q=chair"
```

## 8. Frontend Configuration

Make sure your frontend JavaScript points to the correct API endpoints:

```javascript
const API_CONFIG = {
    baseUrl: '/api', // Adjust if your API is on a different domain
    endpoints: {
        products: '/products',
        filter: '/products/filter',
        search: '/products/search'
    }
};
```

## 9. Error Handling

The frontend handles these error scenarios:
- Network errors
- HTTP status errors
- Empty results
- API response format errors

## 10. Performance Tips

- Add database indexes on frequently filtered columns
- Use eager loading to prevent N+1 queries
- Implement caching for filter results
- Use pagination to limit data transfer
- Consider using Redis for session storage

This setup provides a robust foundation for AJAX-powered shop filtering with Laravel!
