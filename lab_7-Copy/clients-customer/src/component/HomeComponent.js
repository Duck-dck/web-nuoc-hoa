import axios from 'axios';
import React, { Component } from 'react';
import ProductItem from './ProductItemComponent';
import '../css/style.css';
import '../css/cac-san-pham.css';
import '../css/header.css';

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
          products: [] // Khởi tạo mảng rỗng để không bị lỗi .map
        };
      }
      
    componentDidMount() {
        // Gọi API lấy danh sách sản phẩm từ Backend cổng 3000
        axios.get('https://web-nuoc-hoa.onrender.com/api/products')
          .then(res => {
            this.setState({ products: res.data });
          })
          .catch(err => console.log(err));
      }
    render(){
      // phần nước hoa Nữ và bộ lọc category === 'nữ'
        console.log("Danh sách sản phẩm hiện tại trong State:", this.state.products);
        const nuProduct = this.state.products.filter(item => item.category === 'Nữ');
        const namProduct = this.state.products.filter(item => item.category === 'Nam');
        const unisexProduct =  this.state.products.filter(item => item.category === 'Unisex');
        const namList = namProduct.map((item) =>{ // hiện lần lượt những item đã qua bộ lọc 
          return(
            <ProductItem key={item._id} product={item} />
          );
        });
        const nuList = nuProduct.map((item) =>{ // hiện lần lượt những item đã qua bộ lọc 
          return (
              <ProductItem key={item._id} product={item} />
            );
          });
        const unisexList = unisexProduct.map((item)=> { // hiện lần lượt những item đã qua bộ lọc 
          return(
            <ProductItem key={item._id} product={item}/>
          );
        });
        
        return (
            <div className="container"> 
              {/* <h2 className="text-center">DANH SÁCH SẢN PHẨM</h2> */}
              {/* class "product-grid" phải khớp với CSS của bạn để nó chia cột */}
              <div className="category-section"> {/*--> Danh mục nước hoa Nam <-- README*/}
                <h2 className='category-title'>Nước Hoa Nam</h2>
                <div className="product-grid"> 
                  {namList} {/*chỉ hiện những chai đã thông qua bộ lọc là category = "Nữ" */}
                </div>
              </div>

              <div className="category-section"> {/*--> Danh mục nước hoa Nữ <-- README*/}
                <h2 className='category-title'>Nước Hoa Nữ</h2>
                <div className="product-grid"> 
                  {nuList} {/*chỉ hiện những chai đã thông qua bộ lọc là category = "Nữ" */}
                </div>
              </div>

              <div className="category-section"> {/*--> Danh mục nước hoa Unisex <-- README*/}
                <h2 className='category-title'>Nước Hoa Unisex</h2>
                <div className="product-grid"> 
                  {unisexList} {/*chỉ hiện những chai đã thông qua bộ lọc là category = "Nữ" */}
                </div>
              </div>
            </div>
          );
    }
}

export default Home
