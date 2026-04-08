const express = require('express');
const router = express.Router();
const {AdminDAO, ProductDAO} = require('../models/AdminDAO');
const JwtUtil = require('../utils/JwtUtil');
const { OrderDAO, CustomerDAO } = require('../models/CustomerDAO');
const EmailUtil = require('../utils/EmailUtil');
// Login cho Admin
router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    console.log("🚀 Admin đang thử đăng nhập:", username);

    if (username && password) {
      const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
      
      if (admin) {
        // Tạo token
        const token = JwtUtil.genToken();
        
        // --- CHỖ NÀY QUAN TRỌNG ---
        // Xóa password để không lộ thông tin về Frontend
        delete admin.password; 

        return res.json({ 
          success: true, 
          message: 'Authentication successful', 
          token: token, 
          admin: admin // <--- Đã sửa từ 'result' thành 'admin'
        });
      } else {
        return res.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
      }
    } else {
      return res.json({ success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!' });
    }
  } catch (err) {
    console.error("❌ LỖI ĐĂNG NHẬP ADMIN:", err);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau!' });
  }
});

router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  try {
    const orders = await OrderDAO.selectAll();
    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//order
// Cập nhật trạng thái đơn hàng (Approve/Cancel)
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const newStatus = req.body.status; // Nhận 'APPROVED' hoặc 'CANCELED' từ React
    
    const result = await OrderDAO.update(_id, newStatus);
    if (result) {
      res.json({ success: true, message: 'Cập nhật trạng thái thành công!' });
    } else {
      res.json({ success: false, message: 'Cập nhật thất bại.' });
    }
  });

//customer
router.get('/customers', JwtUtil.checkToken,async function(req, res){
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
//order
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function(req, res){
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);

});
// deactive 
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0); // 0 = Deactive
  res.json(result);
});
//send email
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});
//============================
// Hàm kiểm tra quyền Admin
//============================
const verifyAdmin = (req, res, next) => {
  // Giả sử sau khi login, bạn lưu admin vào session hoặc token
  if (req.session && req.session.admin) {
    next(); // Cho phép đi tiếp
  } else {
    res.status(401).json({ success: false, message: "Cút! Bạn không có quyền!" });
  }
};

// Áp dụng ổ khóa này vào các Route quan trọng
// router.post('/products', verifyAdmin, async (req, res) => { /* Code thêm */ });
// router.delete('/products/:id', verifyAdmin, async (req, res) => { /* Code xóa */ });
//=======================================


// --- QUẢN LÝ PRODUCT ---
router.get('/products', async (req, res) => {
  const products = await ProductDAO.selectAll();
  res.json(products);
});

router.post('/products', async (req, res) => {
  const product = req.body; // Gồm name, price, image, categoryID
  const result = await ProductDAO.insert(product);
  res.json(result);
});
//Phần delete của product dành cho admin 
router.delete('/products/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await ProductDAO.delete(_id);
    
    if (result) {
      res.json({ success: true, message: "Xóa thành công!" });
    } else {
      res.json({ success: false, message: "Không tìm thấy sản phẩm để xóa." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;
