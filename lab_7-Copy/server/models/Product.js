const mongoose = require('mongoose');

// Định nghĩa cấu trúc của một sản phẩm (phải khớp với cái bạn muốn hiện)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Đường dẫn ảnh (ví dụ: images/...)
  brand: { type: String },
  category: { type: String, ref: 'Category' } // Nếu có phân loại
}, { collection: 'product' });

const Product = mongoose.model('Product', ProductSchema, 'product');

// CHỈ EXPORT MODEL NÀY THÔI
module.exports = Product;