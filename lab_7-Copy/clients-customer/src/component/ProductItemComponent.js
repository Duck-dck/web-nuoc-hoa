// ProductItem.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ProductItemComponent extends Component {
  render() {
    console.log("hello !!!")
    const { product } = this.props; // Nhận dữ liệu từ HomeComponent truyền sang
    const item = this.props.product;
    return (
      <div className="product-item"> 
        <div className="product-img">
          {/* Thay thẻ <a> bằng <Link> để không bị load lại trang */}
          <Link to={`/product/${product._id}`}>
            <img src={"/" + item.image} alt="" width="100%"/> {/*Đây là phần hình của sản phẩm */}
          </Link>
        </div>
        
        <Link to={`/product/${product._id}`}>
          <h4>{product.brand}</h4>      {/*Đây là phần brand của sản phẩm */}
        </Link>
        
        <p className="product-info">
          <Link to={`/product/${product._id}`}>{product.name}</Link> {/*Đây là phần tên của sản phẩm */}
        </p>
        
        {/* Dùng toLocaleString để tự động thêm dấu chấm phân cách hàng nghìn */}
        <p className="price">{product.price.toLocaleString()} ₫</p> {/*Đây là phần giá của sản phẩm */}
      </div>
    );
  }
}

export default ProductItemComponent;