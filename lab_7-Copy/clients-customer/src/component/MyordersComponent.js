import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContexts';

class Myorders extends Component {
  static contextType = MyContext; // Truy cập global state qua this.context

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  render() {
    console.log("💎 Kiểm tra Order đang chọn:", this.state.order);
    // 1. Kiểm tra quyền truy cập
    if (this.context.token === '') return <Navigate replace to="/login" />;

    // 2. Render danh sách các đơn hàng
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer ? item.customer.name : this.context.customer.name}</td>
          <td>{item.customer ? item.customer.phone : this.context.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
        </tr>
      );
    });

    // 3. Render chi tiết một đơn hàng khi được chọn
    let orderDetail = null;
    if (this.state.order && this.state.order.items && this.state.order.items.length > 0) {
      const items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img src={"/" + item.product.image} width="70px" height="70px" alt="" />
            </td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });

      orderDetail = (
        <div className="align-center">
          <h2 className="text-center">ORDER DETAIL</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>No.</th>
                <th>Prod. ID</th>
                <th>Prod. name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
              {items}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID Product</th>
                <th>Creation date</th>
                <th>Cust. name</th>
                <th>Cust. phone</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>
        {orderDetail}
      </div>
    );
  }

  componentDidMount(prevProps) {
    if (!this.state.orders.length && this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  // Event handlers
  trItemClick = (item) => {
    this.setState({ order: item });
  }

  // APIs
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      console.log("🔥 Đơn hàng về rồi sếp ơi:", res.data);
      this.setState({ orders: res.data });
    }).catch(err => {
      console.error("Lỗi lấy đơn hàng:", err);
    });
  }
  // apiGetOrdersByCustID(cid) {
  //   const config = { headers: { 'x-access-token': this.context.token } };
  //   axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
  //     const result = res.data;
  //     this.setState({ orders: result });
  //   });
  // }
}

export default Myorders;