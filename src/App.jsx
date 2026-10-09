import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, ShoppingCart, Heart, Star, Menu, X, MapPin, Trash2
} from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch 100 Products Safely from API
  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data && data.products) {
          const formattedProducts = data.products.map(p => ({
            id: p.id,
            title: p.title || "Product Item",
            category: p.category || "General",
            price: Math.round((p.price || 10) * 83),
            originalPrice: Math.round(((p.price || 10) / (1 - (p.discountPercentage || 10) / 100)) * 83),
            rating: p.rating || 4.2,
            reviewsCount: (p.stock || 10) * 12,
            isPrime: (p.rating || 4) >= 4.0,
            image: p.thumbnail || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
            description: p.description || "No description available."
          }));

          // Premium Smartphones Collection Added Manually
          const extraSmartphones = [
            {
              id: 901,
              title: "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium",
              category: "smartphones",
              price: 134900,
              originalPrice: 159900,
              rating: 4.8,
              reviewsCount: 3450,
              isPrime: true,
              image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
              description: "FORGED IN TITANIUM — iPhone 15 Pro Max features a light titanium design with A17 Pro chip."
            },
            {
              id: 902,
              title: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)",
              category: "smartphones",
              price: 129999,
              originalPrice: 144999,
              rating: 4.7,
              reviewsCount: 2190,
              isPrime: true,
              image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
              description: "Welcome to the era of mobile AI with S Pen, 200MP Camera and Snapdragon 8 Gen 3."
            },
            {
              id: 903,
              title: "OnePlus 12 5G (16GB RAM, 512GB Storage)",
              category: "smartphones",
              price: 69999,
              originalPrice: 74999,
              rating: 4.6,
              reviewsCount: 1840,
              isPrime: true,
              image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
              description: "Snapdragon 8 Gen 3 with 4th Gen Hasselblad Camera System for Mobile."
            }
          ];

          setProducts([...extraSmartphones, ...formattedProducts]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  // Category List
  const categories = useMemo(() => {
    if (!products.length) return ['All', 'smartphones'];
    const unique = ['All', 'smartphones', ...new Set(products.map(p => p.category))];
    return Array.from(new Set(unique));
  }, [products]);

  // Search and Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  // Cart Management
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.some(item => item.id === product.id)
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ backgroundColor: '#e3e6e6', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>

      {/* 1. HEADER */}
      <header style={{ backgroundColor: '#131921', color: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', gap: '16px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSelectedCategory('All')}>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>
              amazon<span style={{ color: '#febd69' }}>-clone</span>
            </span>
          </div>

          {/* Deliver Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}>
            <MapPin size={16} color="#cccccc" />
            <div>
              <p style={{ color: '#ccc', fontSize: '10px', margin: 0 }}>Deliver to New Delhi</p>
              <p style={{ fontWeight: 'bold', margin: 0 }}>110001</p>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '40px', borderRadius: '4px', overflow: 'hidden', maxWidth: '700px' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ backgroundColor: '#f3f3f3', color: '#333', fontSize: '12px', padding: '0 8px', height: '100%', border: 'none', cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat === 'smartphones' ? 'Smartphones & Mobiles' : cat}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search Smartphones, Laptops, Gadgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', height: '100%', padding: '0 12px', color: '#000', fontSize: '14px', border: 'none', outline: 'none' }}
            />

            <button style={{ backgroundColor: '#febd69', height: '100%', padding: '0 16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={20} color="#333333" />
            </button>
          </div>

          {/* Wishlist */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert(`Wishlist Items: ${wishlist.length}`)}>
            <Heart size={24} />
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#f3a847', color: 'black', fontWeight: 'bold', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlist.length}
              </span>
            )}
          </div>

          {/* Cart */}
          <div
            onClick={() => setIsCartOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={30} />
              <span style={{ position: 'absolute', top: '-2px', left: '10px', backgroundColor: '#f3a847', color: 'black', fontWeight: 'bold', fontSize: '12px', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '8px' }}>Cart</span>
          </div>

        </div>

        {/* Sub Header Navigation */}
        <div style={{ backgroundColor: '#232f3e', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', overflowX: 'auto', color: 'white' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <Menu size={18} /> All
          </button>
          <span
            onClick={() => setSelectedCategory('smartphones')}
            style={{ cursor: 'pointer', whitespace: 'nowrap', fontWeight: 'bold', color: '#febd69' }}
          >
            📱 Smartphones & Mobiles
          </span>
          <span onClick={() => setSelectedCategory('All')} style={{ cursor: 'pointer', whitespace: 'nowrap' }}>All Deals</span>
          <span onClick={() => setSelectedCategory('laptops')} style={{ cursor: 'pointer', whitespace: 'nowrap' }}>Laptops</span>
          <span onClick={() => setSelectedCategory('fragrances')} style={{ cursor: 'pointer', whitespace: 'nowrap' }}>Fragrances</span>
          <span onClick={() => setSelectedCategory('groceries')} style={{ cursor: 'pointer', whitespace: 'nowrap' }}>Groceries</span>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <div style={{ backgroundColor: '#ffd875', padding: '24px 20px', marginBottom: '20px', textAlign: 'center', borderBottom: '1px solid #ccc' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111', margin: 0 }}>
          {selectedCategory === 'smartphones' ? '📱 Mobile & Smartphone Store' : 'Great Indian Festival Deals'}
        </h1>
        <p style={{ color: '#333', marginTop: '6px', fontSize: '14px' }}>
          Showing {filteredProducts.length} Items {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'from 100+ Catalog'}
        </p>
      </div>

      {/* 3. PRODUCTS GRID */}
      <main style={{ maxWidth: '1250px', margin: '0 auto', padding: '0 16px 48px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3 style={{ color: '#131921' }}>Loading 100+ Products & Smartphones...</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
              >
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px', borderRadius: '50%', backgroundColor: '#f8f8f8', border: 'none', cursor: 'pointer', zIndex: 10 }}
                >
                  <Heart size={18} fill={wishlist.some(w => w.id === product.id) ? "#ef4444" : "none"} color={wishlist.some(w => w.id === product.id) ? "#ef4444" : "#888"} />
                </button>

                <div>
                  <div
                    style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px', backgroundColor: '#fbfbfb', borderRadius: '4px' }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <span style={{ fontSize: '10px', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', color: '#555', textTransform: 'uppercase', fontWeight: 'bold' }}>{product.category}</span>

                  <h3
                    onClick={() => setSelectedProduct(product)}
                    style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginTop: '6px', cursor: 'pointer', height: '36px', overflow: 'hidden', lineHeight: '1.3' }}
                  >
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', color: '#ffa41c' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#007185', fontWeight: '500', marginLeft: '4px' }}>{product.rating.toFixed(1)} ({product.reviewsCount})</span>
                  </div>

                  {/* Price */}
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice > product.price && (
                      <span style={{ fontSize: '11px', color: '#767676', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  {product.isPrime && (
                    <p style={{ fontSize: '11px', color: '#007185', fontWeight: 'bold', marginTop: '2px' }}>
                      <span style={{ backgroundColor: '#007185', color: 'white', fontSize: '9px', padding: '1px 4px', borderRadius: '2px', fontStyle: 'italic', marginRight: '4px' }}>prime</span>
                      FREE Delivery
                    </p>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  style={{ width: '100%', marginTop: '14px', backgroundColor: '#ffd814', border: '1px solid #fcd200', borderRadius: '20px', padding: '7px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. CART DRAWER */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '400px', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Shopping Cart ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={48} color="#ccc" />
                <p style={{ color: '#777', marginTop: '8px' }}>Your Cart is empty</p>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ padding: '12px 0', display: 'flex', gap: '16px', borderBottom: '1px solid #eee' }}>
                    <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>{item.title}</h4>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0' }}>₹{item.price.toLocaleString('en-IN')}</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px' }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ padding: '2px 8px', backgroundColor: '#f0f0f0', border: 'none', cursor: 'pointer' }}>-</button>
                          <span style={{ padding: '0 8px', fontSize: '12px', fontWeight: 'bold' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ padding: '2px 8px', backgroundColor: '#f0f0f0', border: 'none', cursor: 'pointer' }}>+</button>
                        </div>
                        <button onClick={() => updateQty(item.id, -item.qty)} style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={() => alert("Order Placed Successfully! 🎉")}
                  style={{ width: '100%', backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Proceed to Buy
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '550px', width: '100%', padding: '24px', position: 'relative' }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '180px', height: '180px', objectFit: 'contain' }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{selectedProduct.title}</h2>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#b12704', margin: '8px 0' }}>₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                <p style={{ fontSize: '12px', color: '#555', marginBottom: '16px', lineHeight: '1.4' }}>{selectedProduct.description}</p>

                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  style={{ width: '100%', backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '10px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}