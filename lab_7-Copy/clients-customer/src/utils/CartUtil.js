const CartUtil = {
    // 1. Tính tổng thành tiền của cả giỏ hàng
    getTotal(mycart) {
      let total = 0;
      if (mycart && mycart.length > 0) {
        for (const item of mycart) {
          // Kiểm tra an toàn: đảm bảo product và price tồn tại
          const price = item.product?.price || 0;
          const quantity = item.quantity || 0;
          total += price * quantity;
        }
      }
      return total;
    }}

export default CartUtil;