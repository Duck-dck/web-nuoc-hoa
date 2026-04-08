const express = require('express');
const Product = require('../models/Models');
const router = express.Router();
const {CustomerDAO, OrderDAO} = require('../models/CustomerDAO');
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');
  // 1. SIGNUP (Đăng ký)
router.post('/signup', async function (req, res) {
    try {
        const { username, password, name, phone, email } = req.body;
        console.log("--- Đang xử lý đăng ký cho:", username);

        // Kiểm tra trùng lặp
        const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
        if (dbCust) {
            return res.json({ success: false, message: 'Exists username or email' });
        }

        // Mã hóa mật khẩu và tạo token kích hoạt
        const hashedPassword = CryptoUtil.md5(password); 
        const token = CryptoUtil.md5(new Date().getTime().toString());
        const newCust = { username, password: hashedPassword, name, phone, email, active: 0, token: token };

        // Lưu vào DB
        const result = await CustomerDAO.insert(newCust);
        if (result) {
            // Gửi email giả lập (hoặc thật tùy cấu hình EmailUtil)
            const sendEmail = await EmailUtil.send(email, result._id, token);
            res.json({ success: true, message: 'Please check email' });
        } else {
            res.json({ success: false, message: 'Insert failure' });
        }
    } catch (error) {
        console.error("LỖI SIGNUP:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. ACTIVE ACCOUNT (Kích hoạt)
router.post('/active', async function (req, res) {
    const { id, token } = req.body;
    const result = await CustomerDAO.active(id, token, 1);
    if (result) {
        console.log(`✅ User ${id} đã kích hoạt thành công!`);
        res.json(true);
    } else {
        res.json(false);
    }
});

// 3. LOGIN (Đăng nhập cho Customer)
router.post('/login', async function (req, res) {
    try {
      const { username, password } = req.body;
  
      console.log("--- DEBUG LOGIN ---");
      console.log("1. Username nhận được:", username);
      console.log("2. Password (MD5) nhận được:", password);
  
      if (username && password) {
        // Tìm customer trong Database
        const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
  
        console.log("3. Kết quả truy vấn DB:", customer ? "Đã tìm thấy User!" : "KHÔNG tìm thấy ai khớp cả");
  
        if (customer) {
          // Kiểm tra trạng thái active (Ép kiểu Number cho chắc chắn)
          if (Number(customer.active) === 1) {
            const token = JwtUtil.genToken();
            console.log(`🔑 User ${username} đăng nhập thành công!`);
            
            // Trả về kết quả cho React
            return res.json({ 
              success: true, 
              message: 'Authentication successful', 
              token: token, 
              customer: customer 
            });
          } else {
            console.log("⚠️ Tài khoản tồn tại nhưng chưa Active (active = 0)");
            return res.json({ success: false, message: 'Account is deactive' });
          }
        } else {
          return res.json({ success: false, message: 'Incorrect username or password' });
        }
      } else {
        return res.json({ success: false, message: 'Please input username and password' });
      }
    } catch (err) {
      console.error("❌ LỖI HỆ THỐNG:", err);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  });          

// 4. UPDATE PROFILE (Cập nhật thông tin)
router.put('/:id', async function (req, res) {
    const _id = req.params.id;
    const newCust = req.body;
    // Nếu user đổi pass, hãy băm pass mới trước khi lưu
    if (newCust.password && newCust.password.length < 30) {
        newCust.password = CryptoUtil.md5(newCust.password);
    }
    const result = await CustomerDAO.update(_id, newCust);
    res.json(result);
});


//5. My cart
router.post('/checkout',JwtUtil.checkToken,async function(req,res){
    const now = new Date().getTime();
    const total = req.body.total;
    const items = req.body.items;
    const customer = req.body.customer;
    const order = {cdate:now,total:total,status:'PENDING',customer:customer,items:items
    };
    const result = await OrderDAO.insert (order);
    if (result) {
      res.json(result); // Trả về kết quả thực từ DB
    } else {
      res.status(500).json({ message: 'Lưu thất bại!' });
    }});

//6. My orders
router.get ('/orders/customer/:cid', JwtUtil.checkToken , async function (req,res){
  try {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid); 
    res.json(orders);
} catch (err) {
    console.error("Lỗi lấy đơn hàng:", err);
    res.status(500).json({ message: "Lỗi Server rồi sếp!" });
}
});

//7. Kệ hàng 
// Khi React gọi GET /api/customer/products, hàm này sẽ chạy
router.get('/products', async (req, res) => {
    try {
      const products = await Product.find().exec();
      res.json(products);
    } catch (err) {
      // Dòng này sẽ in lỗi chi tiết ra Terminal (cái bảng đen chạy node)
      console.error("LỖI TẠI ĐÂY NÈ:", err); 
      res.status(500).json(err);
    }
  });
// 8. Chi tiết sản phẩm
router.get('/products/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        // Phải dùng Product.findById (P viết hoa)
        const item = await Product.findById(_id).exec(); 
        
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (err) {
        console.error("Lỗi Detail:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
