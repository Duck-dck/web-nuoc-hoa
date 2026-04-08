const mongoose = require('mongoose');

// Định nghĩa cấu trúc người dùng (Customer)
const CustomerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Number, default: 0 }, // 0: chưa active, 1: đã active
  token: { type: String }
  
}, { versionKey: false,
  collection: 'customers' });

// Định nghĩa cấu trúc order
const OrderSchema = new mongoose.Schema({
  cdate: Number,
  total: Number,
  status: String,
  customer: { _id: String, name: String, phone: String, address: String },
  items: [] // Sếp chỉ để mảng rỗng thế này thôi cho tôi!
}, { versionKey: false });

//Định nghĩa cấu truc Admin
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
  },
  { collection: 'admins', versionKey: false 
});



//định nghĩa cấu trúc cho sản phẩm (product)
const ProductSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  image: {type: String},
  brand:{type: String},
  category: { type: String } // Liên kết với Category
}, { collection: 'products' });

// Xuất model để các file khác (như CustomerDAO) có thể dùng
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');

module.exports = {Product, Customer, Admin, Order };
