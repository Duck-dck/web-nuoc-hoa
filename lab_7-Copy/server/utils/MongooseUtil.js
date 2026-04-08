const mongoose = require('mongoose');

// Thay đổi chuỗi kết nối nếu bạn dùng MongoDB Atlas hoặc tên DB khác
const uri = 'mongodb+srv://admin:Thinh2005@cluster0.sr4aluo.mongodb.net/shopping?appName=Cluster0'; 

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Kết nối thành công đến MongoDB: ' + uri);
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });

module.exports = mongoose;
