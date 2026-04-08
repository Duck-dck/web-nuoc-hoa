import React, { Component } from 'react';
import MyContext from '../contexts/MyContexts';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';


class Mycart extends Component {
  static contextType = MyContext; // Truy cập global state

  render() {
    const mycartData = this.context.mycart; // Lấy dữ liệu thô từ context ra trước
    console.log("Dữ liệu trong Context:", mycartData);
    const mycartRows = mycartData.map((item, index) => {
      const total = item.product.price * item.quantity;
      return (
        
        <tr key={item.product._id} className="datatable">
          <td>{index + 1}</td>
          <td>{item.product._id}</td>
          <td>{item.product.name}</td>
          <td>{item.product.category.name}</td>
          <td>
            <img 
              src={"/" + item.product.image} 
              width="70px" 
              height="70px" 
              alt="" 
            />
          </td>
          <td>{item.product.price.toLocaleString()} đ</td>
          <td>{item.quantity}</td>
          <td>{total.toLocaleString()} đ</td>
          <td>
            <span className="link" onClick={() => this.lnkRemoveClick(item.product._id)}>
              Remove
            </span>
          </td>
        </tr>
      );
    });

    return (
      <div className="align-center">
        <h2 className="text-center">ITEM LIST</h2>
        <table className="datatable" border="1">
          <tbody>
            <tr className="datatable">
              <th>No.</th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
            {mycartRows}
            <tr>
              <td colSpan="6"></td>
              <td>Total</td>
              <td>{CartUtil.getTotal(this.context.mycart).toLocaleString()} đ</td> 
              <td>
                <span className="link" onClick={() => this.lnkCheckoutClick()}>
                  CHECKOUT
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // --- HÀM XỬ LÝ (Sẽ làm ở bước tiếp theo) ---
  lnkRemoveClick = (id) => {
    const mycart = this.context.mycart;
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick = () => {
    if (window.confirm('ARE YOU SURE?')) {
      if (this.context.mycart.length > 0) {
        // Gọi API checkout ở đây
        const total = CartUtil.getTotal (this.context.mycart );
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
            this.apiCheckout ( total,items,customer );
            } else {
            this.props.navigate ('/home');
            }
        // alert('Checkout logic will be here!');
      } else {
        alert('Your cart is empty');
      }
    }
  }
  // API 
  apiCheckout (total,items,customer){
    console.log("🔍 Kiểm tra giỏ hàng trước khi gửi:", items);
    const body = {total:total,items:items,customer: customer};
    const config = {headers: {'x-access-token': this.context.token}};
    axios.post ('/api/customer/checkout',body,config).then((res) => {
    console.log("🔥 Kết quả từ Server trả về:", res.data);
    const result = res.data ;
    if (result) {
        alert('OK BABY !!!');
        this.context.setMycart([]);
        window.location.href = '/home';
    } else{
        alert('SORRY BABY!');
    }
  });

  }
}

export default Mycart;
