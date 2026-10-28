import { useState, useEffect } from 'react';
import { getProducts, getProduct } from './services/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getProducts(12, 0, controller.signal)
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleProductClick = (id) => {
    setDetailLoading(true);
    getProduct(id).then(data => {
      setSelectedProduct(data);
      setDetailLoading(false);
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="app-container">
      <h1>Products (DummyJSON)</h1>
      
      <div className="api-layout">
        <div className="api-grid">
          {products.map(p => (
            <div 
              key={p.id} 
              className="api-card" 
              onClick={() => handleProductClick(p.id)}
            >
              <div className="api-image-container">
                <img src={p.thumbnail} alt={p.title} />
              </div>
              <h4>{p.title}</h4>
              <p className="api-price">${p.price}</p>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="detail-panel">
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>Close</button>
            {detailLoading ? (
              <p>Loading details...</p>
            ) : (
              <>
                <img className="detail-image" src={selectedProduct.thumbnail} alt={selectedProduct.title} />
                <h2>{selectedProduct.title}</h2>
                <p className="detail-desc">{selectedProduct.description}</p>
                <div className="detail-stats">
                  <p><strong>Price:</strong> ${selectedProduct.price}</p>
                  <p><strong>Rating:</strong> {selectedProduct.rating} / 5</p>
                  <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}