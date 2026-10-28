export default function ProductCard({
  name,
  price,
  inStock = true,
  image,
  children 
}) {
  return (
    <div className="card">
      <div className="image-container">
        {price < 20 && <span className="badge">Low price!</span>}
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <span>No image</span>
        )}
      </div>
      <h3>{name}</h3>
      <p className="price">{price} USD</p>
      {inStock ? (
        <span className="stock in">In stock</span>
      ) : (
        <span className="stock out">Sold out</span>
      )}
      {children} {/* This will render the "Add to cart" button at the bottom */}
    </div>
  );
}