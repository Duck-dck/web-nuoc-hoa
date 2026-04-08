import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContexts';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  // --- Event Handlers (Sử dụng Arrow Function để tránh lỗi 'this') ---
  trCustomerClick = (item) => {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick = (item) => {
    this.setState({ order: item });
  }

  // --- APIs ---
  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  render() {
    // 1. Render danh sách Customer
    const customers = this.state.customers.map((item) => (
      <tr key={item._id} className="datatable" onClick={() => this.trCustomerClick(item)}>
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.password}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>{item.active === 1 ? 'Active' : 'Deactive'}</td>
        <td>
          <span className="link">{item.active === 0 ? 'EMAIL' : 'DEACTIVE'}</span>
        </td>
      </tr>
    ));

    // 2. Render danh sách Order (nếu có)
    const orders = this.state.orders.map((item) => (
      <tr key={item._id} className="datatable" onClick={() => this.trOrderClick(item)}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>{item.customer.phone}</td>
        <td>{item.total.toLocaleString()}</td>
        <td>{item.status}</td>
      </tr>
    ));

    // 3. Render chi tiết sản phẩm trong Order (nếu đã chọn Order)
    let orderDetails = null;
    if (this.state.order) {
      orderDetails = this.state.order.items.map((item, index) => (
        <tr key={item.product._id} className="datatable">
          <td>{index + 1}</td>
          <td>{item.product._id}</td>
          <td>{item.product.name}</td>
          <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
          <td>{item.product.price.toLocaleString()}</td>
          <td>{item.quantity}</td>
          <td>{(item.product.price * item.quantity).toLocaleString()}</td>
        </tr>
      ));
    }

    return (
      <div className="align-center">
        {/* BẢNG CUSTOMER */}
        <h2 className="text-center">CUSTOMER LIST</h2>
        <table className="datatable" border="1">
          <thead>
            <tr className="datatable">
              <th>ID</th><th>Username</th><th>Password</th><th>Name</th><th>Phone</th><th>Email</th><th>Active</th><th>Action</th>
            </tr>
          </thead>
          <tbody>{customers}</tbody>
        </table>

        {/* BẢNG ORDER (Chỉ hiện khi có dữ liệu) */}
        {this.state.orders.length > 0 && (
          <div className="align-center">
            <h2 className="text-center">ORDER LIST</h2>
            <table className="datatable" border="1">
              <thead>
                <tr className="datatable">
                  <th>ID</th><th>Creation date</th><th>Cust. name</th><th>Cust. phone</th><th>Total</th><th>Status</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        )}

        {/* BẢNG CHI TIẾT SẢN PHẨM */}
        {this.state.order && (
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <thead>
                <tr className="datatable">
                  <th>No.</th><th>Prod. ID</th><th>Prod. name</th><th>Image</th><th>Price</th><th>Quantity</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>{orderDetails}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Customer;