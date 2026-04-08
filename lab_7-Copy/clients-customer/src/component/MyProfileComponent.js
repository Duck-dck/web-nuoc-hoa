import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContexts'; // Đảm bảo đúng đường dẫn

class MyProfile extends Component {
  static contextType = MyContext; // Sử dụng Context để lấy thông tin user đã login

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: ''
    };
  }

  componentDidMount() {
    // Khi vừa mở trang, lấy thông tin từ Context đổ vào State
    if (this.context.customer) {
      const cust = this.context.customer;
      this.setState({
        txtUsername: cust.username,
        txtPassword: cust.password,
        txtName: cust.name,
        txtPhone: cust.phone,
        txtEmail: cust.email
      });
    }
  }

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">MY PROFILE</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Username</td>
                <td><input type="text" value={this.state.txtUsername} disabled /></td>
              </tr>
              <tr>
                <td>Password</td>
                <td><input type="password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} /></td>
              </tr>
              <tr>
                <td>Name</td>
                <td><input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} /></td>
              </tr>
              <tr>
                <td>Phone</td>
                <td><input type="tel" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} /></td>
              </tr>
              <tr>
                <td>Email</td>
                <td><input type="email" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} /></td>
              </tr>
              <tr>
                <td></td>
                <td><input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    if (txtPassword && txtName && txtPhone && txtEmail) {
      const customer = { 
        _id: this.context.customer._id, // Cần ID để Server biết sửa ai
        username: txtUsername, 
        password: txtPassword, 
        name: txtName, 
        phone: txtPhone, 
        email: txtEmail 
      };
      this.apiUpdate(customer);
    } else {
      alert('Please input all fields');
    }
  }

  apiUpdate(customer) {
    axios.put('/api/customer/' + customer._id, customer).then((res) => {
      if (res.data) {
        alert('Cập nhật thông tin thành công!');
        this.context.setCustomer(res.data); // Cập nhật lại Context để các trang khác thay đổi theo
      } else {
        alert('Cập nhật thất bại!');
      }
    });
  }
}
export default MyProfile;