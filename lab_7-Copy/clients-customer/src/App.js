import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import MyContext from './contexts/MyContexts';

// Import Components
import MyProfileComponent from './component/MyProfileComponent';
import ActiveComponent from './component/ActiveComponent';
import LoginComponent from './component/LoginComponent';
import SignupComponent from './component/SignupComponent';
import Myorders from './component/MyordersComponent';
import MycartComponent from './component/MycartComponent';
import HomeComponent from './component/HomeComponent';
import ProductDetailComponent from './component/ProductDetailComponent';
import CustomerComponent from './component/CustomerComponent';
import AdminProductComponent from './component/AdminProductComponent';

import './css/style.css';

class App extends Component {
  static contextType = MyContext;

  // Hàm Logout dọn dẹp sạch sẽ
  lnkLogoutClick = () => {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setAdmin(null);
    this.context.setMycart([]);
    // Chuyển hướng về login sẽ do thẻ Link đảm nhận hoặc dùng useNavigate
  };

  render() {
    const { token, admin, customer, mycart } = this.context;

    return (
      <BrowserRouter>
        <div className="App">
          <header className="app-header">
            <h1 className="main-logo">Hệ thống Quản lý Nước hoa</h1>
            
            <nav className="navbar">
              {/* 1. THANH TOP NAV: Đăng nhập / Profile */}
              <ul className="nav-top">
                {!token ? (
                  <>
                    <li><Link to="/login">Đăng nhập</Link></li>
                    <li><Link to="/signup">Đăng ký</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/myprofile">Xin chào, {admin ? 'Admin' : customer?.name}</Link></li>
                    <li><Link to="/login" onClick={this.lnkLogoutClick}>Đăng xuất</Link></li>
                  </>
                )}
              </ul>

              {/* 2. THANH MENU CHÍNH: Phân quyền hiển thị */}
              <ul className="nav-menu">
                <li><Link to='/home'>Home</Link></li>
                
                {/* --- MENU DÀNH CHO ADMIN --- */}
                {admin && !customer &&(
                  
                  <>
                    
                    <li className="admin-link"><Link to='/admin/order'>Admin Order</Link></li>
                    <li className="admin-link"><Link to='/admin/customer'>Customer</Link></li>
                    <li className="admin-link">
                      <Link to='/admin/product'><i className="fa fa-cube"></i> Quản lý Sản phẩm</Link>
                    </li>
                  </>
                )}

                {/* --- MENU DÀNH CHO KHÁCH HÀNG --- */}
                {customer && !admin && (
                  <>
                    <li><Link to='/customer/order'>Đơn hàng của tôi</Link></li>
                    <li>
                      <Link to='/mycart' className="cart-btn">
                        Giỏ hàng <span className="badge">{mycart.length}</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </header>

          <hr className="divider"/>

          <main className="content-area">
            <Routes>
              {/* ROUTE CÔNG KHAI */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomeComponent />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/signup" element={<SignupComponent />} />
              <Route path="/product/:id" element={<ProductDetailComponent />} />
              <Route path="/active" element={<ActiveComponent />} />

              {/* ROUTE BẢO VỆ CHO CUSTOMER */}
              <Route path="/myprofile" element={token ? <MyProfileComponent /> : <Navigate to="/login" />} />
              <Route path="/mycart" element={customer ? <MycartComponent /> : <Navigate to="/login" />} />
              <Route path="/myorders" element={customer ? <Myorders /> : <Navigate to="/login" />} />
              <Route path="/customer/order" element={customer ? <Myorders /> : <Navigate to="/login" />} />

              {/* ROUTE BẢO VỆ CHO ADMIN (CỰC KỲ QUAN TRỌNG) */}
              <Route path="/admin/product" element={admin ? <AdminProductComponent /> : <Navigate to="/login" />} />
              <Route path="/admin/customer" element={admin ? <CustomerComponent /> : <Navigate to="/login" />} />
              <Route path="/admin/order" element={admin ? <Myorders /> : <Navigate to="/login" />} />

              {/* TRANG 404 NẾU GÕ SAI URL */}
              <Route path="*" element={<div style={{textAlign:'center', padding:'50px'}}><h2>404 - Không tìm thấy trang!</h2></div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;