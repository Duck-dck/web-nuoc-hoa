const Models = require('./Models'); // Đảm bảo gọi đúng file Models.js cùng thư mục

const AdminDAO = {
  // Tên hàm phải viết HOA các chữ cái đầu (camelCase) đúng như thế này
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query); 
    return admin;
  }
};



// Hàm chức năng Product
const ProductDAO = {
  async selectAll() {
    // populate('category') để lấy luôn tên danh mục thay vì mỗi cái ID
    return await Models.Product.find().exec();
  },
  async insert(product) {
    try {
      const newProduct = new Models.Product(product);
      const result = await newProduct.save();
      return result; 
    } catch (err) {
      console.error("LỖI LƯU DATABASE:", err.message); // Soi cái này ở bảng đen Node.js
      return null;
    }
  },
  async update(product) {
    return await Models.Product.findByIdAndUpdate(product._id, product, { new: true });
  },
  async delete(_id) {
    // Xóa sản phẩm dựa trên ID truyền vào
    const result = await Models.Product.findByIdAndDelete(_id);
    return result;
  }
};

// CỰC KỲ QUAN TRỌNG: Dòng này giúp file api/admin.js "thấy" được hàm trên
module.exports ={AdminDAO, ProductDAO};