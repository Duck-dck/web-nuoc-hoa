const Models = require('./Models');
const mongoose = require('mongoose');

// ==========================================
// 1. ORDER DAO (Xử lý Đơn hàng)
// ==========================================
// const { Customer, Order } = require('./Models');
const OrderDAO = {
  // Tạo đơn hàng mới
  // dùng Models.Order.create ko cần khai báo biến Order lấy thẳng biến trong Models
  async insert(order) {
    try {
      console.log("💎 DAO đang lưu đơn hàng:", JSON.stringify(order, null, 2));
      const result = await Models.Order.create(order);
      return result;
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      return null;
    }
  },

  // Lấy toàn bộ đơn hàng (sắp xếp mới nhất lên đầu)
  async selectAll() {
    try {
      const query = {};
      const mysort = { cdate: -1 };
      return await Models.Order.find(query).sort(mysort).exec();
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
      return [];
    }
  },

  // Lấy đơn hàng theo ID Khách hàng
  async selectByCustID(_cid) {
    try {
      const orders = await Models.Order.find({ 'customer._id': _cid })
        .populate({
        path: 'items.product', // Đi sâu vào từng item để lấy product
        model: 'Product'       // Chỉ định rõ lấy từ bảng Product
      }).exec();
      return orders;
    } catch (err) {
      // báo lỗi đúng nơi để fix
      console.error("Lỗi lấy đơn hàng theo ID khách:", err);
      return [];
    }
  },

  // Cập nhật trạng thái đơn hàng (Admin dùng)
  async update(_id, newStatus) {
    try {
      const newvalues = { status: newStatus };
      return await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
    } catch (err) {
      console.error("Lỗi update trạng thái đơn hàng:", err);
      return null;
    }
  }
};

// ==========================================
// 2. CUSTOMER DAO (Xử lý Khách hàng)
// ==========================================
const CustomerDAO = {
  // Tìm kiếm theo Username hoặc Email (Dùng khi Đăng ký/Check trùng)
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    return await Models.Customer.findOne(query);
  },

  // Đăng nhập: Tìm theo Username và Password
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query); // Tìm kiếm
    return customer;
    
  },

  // Thêm mới Khách hàng
  async insert(customer) {
    try {
      return await Models.Customer.create(customer);
    } catch (err) {
      console.error("Lỗi insert khách hàng:", err);
      return null;
    }
  },

  // Kích hoạt tài khoản
  async active(_id, token, activeStatus) {
    try {
      const query = { _id: _id, token: token };
      const newvalues = { active: activeStatus };
      return await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
    } catch (err) {
      console.error("Lỗi active khách hàng:", err);
      return null;
    }
  },

  // Lấy danh sách khách hàng (Admin dùng)
  async selectAll() {
    try {
      return await Models.Customer.find({}).exec();
    } catch (err) {
      console.error("Lỗi lấy danh sách khách hàng:", err);
      return [];
    }
  },
  // Tìm kiêm theo ID
  async selectByID(_id) {
    return await Models.Customer.findById(_id).exec();
  }
};

// ==========================================
// QUAN TRỌNG: Export cả 2 để các file Controller dùng được
// ==========================================
module.exports = { OrderDAO, CustomerDAO};