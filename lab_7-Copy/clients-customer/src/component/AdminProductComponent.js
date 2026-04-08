import React, { Component } from 'react';
import axios from 'axios';

class AdminProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      txtName: '',
      txtPrice: 0,
      txtBrand: '',
      txtImage: '',
      txtCategory: 'Nam' // Mặc định là Nam
    };
  }

  componentDidMount() {
    this.apiGetProducts();
  }

  // Lấy danh sách sản phẩm từ Server
  apiGetProducts = () => {
    axios.get('/api/admin/products').then((res) => {
      this.setState({ products: res.data });
    });
  };

  // Hàm xử lý khi nhấn nút Thêm
  btnAddClick = (e) => {
    e.preventDefault();
    const { txtName, txtPrice, txtBrand, txtImage, txtCategory } = this.state;
    const item = { name: txtName, price: parseInt(txtPrice), brand: txtBrand, image: txtImage, category: txtCategory };
    
    axios.post('/api/admin/products', item).then((res) => {
        if (res.data && res.data.success !== false) {
          alert('THÊM THÀNH CÔNG!');
          this.setState({
            txtName: '',
            txtPrice: 0,
            txtBrand: '',
            txtImage: '',
            txtCategory: 'Nam' // Về mặc định
          });
          this.apiGetProducts(); // Load lại danh sách
        } else {
          alert('Thất bại: ' + (res.data.message || 'Lỗi server'));
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Lỗi kết nối server!');
      });
  };
// Hàm xử lý logic nút delete 
btnDeleteClick = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      axios.delete('/api/admin/products/' + id).then((res) => {
        if (res.data && res.data.success) {
          alert('Đã xóa thành công!');
          this.apiGetProducts(); // Gọi lại hàm load danh sách để cập nhật giao diện
        } else {
          alert('Xóa thất bại!');
        }
      }).catch(err => console.log(err));
    }
  };
  render() {
    const prods = this.state.products.map((item) => {
      return (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{item.brand}</td>
          <td>{item.category}</td>
          <td><img src={'/'+item.image} width="50" alt="" /></td>
          <td>
            <button 
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => this.btnDeleteClick(item._id)}>
                    Xóa
        </button>
            </td>
        </tr>
      );
    });

    return (
      <div>
        <h2 className="text-center">QUẢN LÝ SẢN PHẨM</h2>
        {/* FORM NHẬP LIỆU */}
        <form style={{marginBottom: '20px'}}>
          <input type="text" placeholder="Tên SP" onChange={(e) => this.setState({ txtName: e.target.value })} />
          <input type="number" placeholder="Giá" onChange={(e) => this.setState({ txtPrice: e.target.value })} />
          <input type="text" placeholder="Thương hiệu" onChange={(e) => this.setState({ txtBrand: e.target.value })} />
          <input type="text" placeholder="Link ảnh" onChange={(e) => this.setState({ txtImage: e.target.value })} />
          <select onChange={(e) => this.setState({ txtCategory: e.target.value })}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <button onClick={(e) => this.btnAddClick(e)}>THÊM MỚI</button>
        </form>

        {/* BẢNG HIỂN THỊ */}
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Tên</th><th>Giá</th><th>Thương hiệu</th><th>Loại</th><th>Ảnh</th>
            </tr>
          </thead>
          <tbody>{prods}</tbody>
        </table>
      </div>
    );
  }
}
export default AdminProduct;