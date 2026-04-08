import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContexts'; // Để dùng giỏ hàng sau này

class ProductDetailComponent extends Component {
  static contextType = MyContext; // Kết nối với giỏ hàng

  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
  }

  btnAddCartClick = (e) => {
    e.preventDefault();
    alert("NÚT BẤM ĐÃ CHẠY!");
    const product = this.state.product;
    const quantity = parseInt(prompt("Bạn muốn mua bao nhiêu chai?", "1"));

    if (quantity > 0 && !isNaN(quantity)) {
        // Nó sẽ gọi trực tiếp hàm addToCart ở file MyProvider
        this.context.addToCart(product, quantity); 
        alert("Đã thêm vào giỏ hàng thành công!");
    }
}
  componentDidMount() {
    // Lấy ID từ URL (Ví dụ: /product/65f1...)
    const id = window.location.pathname.split("/").pop();
    this.apiGetProduct(id);
  }

  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      this.setState({ product: res.data });
    });
  }

  render() {
    const { product } = this.state;
    if (!product) return <div className="loader">Đang tải...</div>;

    return (
      <div className="product-detail-container">
        <div className="detail-wrapper">
          {/* Cột trái: Hình ảnh */}
          <div className="detail-image">
            <img src={"/" + product.image} alt={product.name} width="400px" height="400px"  />
          </div>

          {/* Cột phải: Thông tin */}
          <div className="detail-info">
            <p className="detail-brand">{product.brand}</p>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-price">
              {product.price.toLocaleString()} ₫
            </p>
            
            <div className="detail-description">
              <h3>Mô tả sản phẩm</h3>
              <p>Đây là dòng nước hoa cao cấp thuộc bộ sưu tập {product.category}. 
                 Mang lại hương thơm quyến rũ và bền lâu.</p>
            </div>

            <button className="btn-add-cart" onClick={(e) =>this.btnAddCartClick(e)}>
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetailComponent;