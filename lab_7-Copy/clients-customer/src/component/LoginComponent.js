import React, { useState, useContext } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MyContext from '../contexts/MyContexts';

function LoginComponent() {
  const [txtUsername, setTxtUsername] = useState('');
  const [txtPassword, setTxtPassword] = useState('');
  const { setCustomer, setAdmin, setToken } = useContext(MyContext); // Dùng Context dễ dàng
  const navigate = useNavigate(); // Khai báo navigate

  const btnLoginClick = (e) => {
    e.preventDefault();
    if (txtUsername && txtPassword) {
      const account = { username: txtUsername, password: md5(txtPassword) };
      console.log("Dữ liệu chuẩn bị gửi đi:", { username: txtUsername, password: md5(txtPassword) }); // THÊM DÒNG NÀY
      apiLogin(account);
    } else {
      alert('Vui lòng nhập đầy đủ!');
    }
  };

  const apiLogin = (account) => {
    const loginUrl = account.username === 'admin' ? '/api/admin/login' : '/api/customer/login';

    axios.post(loginUrl, account).then((res) => {
      const result = res.data;
      console.log("🔥 Dữ liệu Server trả về:", result);
  
      if (result.success) { // BƯỚC 1: Phải kiểm tra success TRƯỚC
        // 1. Lưu Token chung
        if (result.token) {
          setToken(result.token);
          localStorage.setItem('token', result.token);
        }
  
        // 2. Chia vai trò (Role)
        if (account.username === 'admin') {
          setAdmin(result.admin);
          alert('Chào Sếp! Đăng nhập ADMIN thành công.');
        } else {
          setCustomer(result.customer);
          setAdmin(null);
          alert('Đăng nhập KHÁCH HÀNG thành công.');
        }
  
        // 3. Chuyển trang
        navigate('/home');
  
      } else { 
        // Sai mật khẩu hoặc user không tồn tại
        alert('Lỗi: ' + result.message);
      }
    }).catch(err => {
      console.error("Lỗi kết nối:", err);
      alert("Không thể kết nối đến Server!");
    });
  };// đóng hàm api login

  return(
    <div className="align-center">
      <h2 className="text-center">CUSTOMER LOGIN</h2>
      <form>
        <table className="align-center">
          <tbody>
            <tr>
              <td>Username</td>
              <td><input type="text" value={txtUsername} onChange={(e) => setTxtUsername(e.target.value)} /></td>
            </tr>
            <tr>
              <td>Password</td>
              <td><input type="password" value={txtPassword} onChange={(e) => setTxtPassword(e.target.value)} /></td>
            </tr>
            <tr>
              <td></td>
              <td><input type="submit" value="LOGIN" onClick={btnLoginClick} /></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
);
}

export default LoginComponent;