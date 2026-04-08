const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const path = require('path');
// 1. Cấu hình chung
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. PHẢI ĐẶT LOG Ở ĐÂY (Để nó bắt được mọi yêu cầu gửi đến)
app.use((req, res, next) => {
  console.log(`🚀 [${new Date().toLocaleTimeString()}] Gọi đến: ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 Dữ liệu body: ", req.body);
  }
  next();
});

// 3. Kết nối Database
require('./server/utils/MongooseUtil');

// 4. Khai báo Route API
const customerApi = require('./server/api/customer');
const adminApi = require('./server/api/admin');

app.use('/api/admin', adminApi); 
app.use('/api/customer', customerApi);

// 5. Test nhanh (Để ngoài app.listen)
app.post('/api/customer/signup/test', (req, res) => {
    console.log("🔥 ĐÃ NHẬN ĐƯỢC REQUEST TEST!");
    res.json({ message: "Server nhận tốt sếp ơi!" });
});
// 5.1. Chỉ phục vụ trang Khách hàng
app.use('/', express.static(path.resolve(__dirname, 'clients-customer/build')));
app.get('/:any(.*)', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'clients-customer/build', 'index.html'));
});

// 6. Lắng nghe (Luôn luôn ở cuối cùng của file)
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`   SERVER LAB 7 ĐANG CHẠY TẠI CỔNG ${PORT}   `);
  console.log("   NẾU THẤY DÒNG NÀY THÌ MỚI ĐÚNG FILE   ");
  console.log("=========================================");
});
