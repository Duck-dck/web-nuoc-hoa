import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContexts';

class Order extends Component {
  static contextType = MyContext; // Truy cập token từ global state

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  render() {
    // 1. Render danh sách đơn hàng (Bảng phía trên)
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer ? item.customer.name : 'N/A'}</td>
          <td>{item.customer ? item.customer.phone : 'N/A'}</td>
          <td>{item.total.toLocaleString()} VNĐ</td>
          <td>{item.status}</td>
          <td>
            {item.status === 'PENDING' ? (
              <div>
                <span className="link" onClick={() => this.lnkApproveClick(item._id)}>APPROVE</span>
                {" || "}
                <span className="link" onClick={() => this.lnkCancelClick(item._id)}>CANCEL</span>
              </div>
            ) : null}
          </td>
        </tr>
      );
    });

    // 2. Render chi tiết sản phẩm của đơn hàng được chọn (Bảng phía dưới)
    let items = [];
    if (this.state.order && this.state.order.items) {
      items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" />
            </td>
            <td>{item.product.price.toLocaleString()}</td>
            <td>{item.quantity}</td>
            <td>{(item.product.price * item.quantity).toLocaleString()}</td>
          </tr>
        );
      });
    }

    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Creation date</th>
                <th>Cust. name</th>
                <th>Cust. phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>

        {this.state.order ? (
          <div className="align-center" style={{ marginTop: '20px' }}>
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
        ) : null}
      </div>
    );
  }
// phần sự kiện của các nút trong Order List
// 1. Xử lý sự kiện khi bấm nút APPROVE
  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  // 2. Xử lý sự kiện khi bấm nút CANCEL
  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  // 3. Gọi API cập nhật trạng thái đơn hàng
  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.put('/api/admin/orders/status/' + id, body, config)
      .then((res) => {
        const result = res.data;
        if (result && result.success) { // Kiểm tra success từ server trả về
          this.apiGetOrders(); // Cập nhật lại danh sách ngay lập tức
        } else {
          alert('SORRY BABY!'); // Lỗi hoặc không đủ quyền
        }
      })
      .catch((err) => {
        console.error("Lỗi update status:", err);
        alert('Lỗi kết nối Server!');
      });
  }
  componentDidMount() {
    this.apiGetOrders();
  }
  // 1. Xử lý khi click vào một dòng trong danh sách đơn hàng
  trItemClick(item) {
    this.setState({ order: item });
  }

  // 2. Gọi API để lấy danh sách tất cả đơn hàng từ Server
  apiGetOrders() {
    // Lấy token từ Context (toàn cục) để chứng minh quyền Admin
    const config = { 
      headers: { 'x-access-token': this.context.token } 
    };

    axios.get('/api/admin/orders', config)
      .then((res) => {
        const result = res.data;
        // Cập nhật mảng orders trong State để React render ra bảng
        this.setState({ orders: result });
      })
      .catch((err) => {
        console.error("Lỗi gọi API Admin:", err);
      });
  }
}

export default Order;