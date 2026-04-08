import React, { Component } from 'react';
import MyContext from './MyContexts';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // --- Dữ liệu đăng nhập (Auth) ---
      token: '',
      customer: null,

      // --- Dữ liệu giỏ hàng (Cart) ---
      mycart: [],
      
      // --- Các hàm cập nhật (tham chiếu từ class methods) ---
      setToken: this.setToken,
      setAdmin: this.setAdmin,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart

    };
  }
  // Hàm cập nhật Token khi Login/Logout
  setToken = (value) => {
    this.setState({ token: value });
  }
  // Hàm cập nhật thông tin người dùng
  setCustomer = (value) => {
    this.setState({ customer: value });
  }
  setAdmin = (value) =>{
    console.log("provider nạp dữ liệu admin vào stage: ", value);
    this.setState({admin: value});
  }


  // Hàm thêm vào giỏ hàng
  addToCart = (product, quantity) => {
    let currentCart = [...this.state.mycart];
    const index = currentCart.findIndex(item => item.product._id === product._id);
  
    if (index !== -1) {
      currentCart[index].quantity += quantity;
  } else {
      currentCart.push({ product: product, quantity: quantity });
  }
  this.setState({ mycart: currentCart }, () => {
    // Dòng này để bạn kiểm tra trong Console xem State đã thay đổi chưa
    console.log("Giỏ hàng sau khi cập nhật trong Provider:", this.state.mycart);
  });
};

  // Hàm cập nhật giỏ hàng (thêm/xóa/sửa số lượng)
  setMycart = (cart) => {
    this.setState({ mycart: cart });
  }

  render() {
    const value = {
      mycart: this.state.mycart,
      addToCart: this.addToCart, // Phải có dòng này thì trang Detail mới thấy
      setMycart: this.setMycart,
      // ... các value cũ ...
      customer: this.state.customer,
      token: this.state.token,
      admin: this.state.admin,
      setAdmin: (admin) => this.setState({admin: admin}),
      setCustomer: (customer) => this.setState({ customer: customer }),
      setToken: (token) => this.setState({ token: token })
  };
    return (
      <MyContext.Provider value={value} >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;