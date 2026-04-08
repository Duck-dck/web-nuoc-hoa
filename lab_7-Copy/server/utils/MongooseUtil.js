const mongoose = require('mongoose');

// Thay đổi chuỗi kết nối nếu bạn dùng MongoDB Atlas hoặc tên DB khác
const uri = 'mongodb://localhost:27017/shopping'; 

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Kết nối thành công đến MongoDB: ' + uri);
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });

module.exports = mongoose;