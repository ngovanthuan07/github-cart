# tìm hiểu thêm

- thuật toán thêm giỏ hàng vào trong java servlet sử dụng session
  - Cách 1: sử dụng ArrayList:

```
			String productId = request.getParameter("productId");
			String quantityCart = request.getParameter("quantity");
			int quantity = 1;
			long id;
			if(productId != null) {
				id = Long.parseLong(productId);
				ProductModel product = productService.findOneById(id);
				if(product != null) {
					if(quantityCart != null) {
						quantity = Integer.parseInt(quantityCart);
					}
					// tạo mới một session
					HttpSession session = request.getSession();
					if(session.getAttribute("cart_item") == null) {
						CartItemModel cart_item = new CartItemModel();
						List<ProductModel> listItem = new ArrayList<ProductModel>();
						// thêm 1 sản phẩm vào list
						ProductModel product__cart = new ProductModel();
						product__cart.setId(product.getId());
						product__cart.setTitle(product.getTitle());
						product__cart.setImage(product.getImage());
						product__cart.setPrice(product.getPrice());
						product__cart.setQuantity(product.getQuantity());
						product__cart.setQuantityOder(quantity);
						listItem.add(product__cart);
						
						// thiết lập list sản phẩm
						cart_item.setProduct(listItem);
						
						session.setAttribute("cart_item", cart_item);
					}
					else {
						// thêm một sản phẩm khi đã có session
						CartItemModel cart_item = (CartItemModel) session.getAttribute("cart_item");
						// lấy list sản phẩm
						List<ProductModel> listItem = cart_item.getProduct();
						boolean check = false;
						// kiểm tra sản phẩm có tồn tại trong giỏ hàng
						for(ProductModel item : listItem) {
							if(item.getId() == product.getId()) {
								// sản phẩm tồn tại thì chỉ cộng quantity thêm 1
								item.setQuantityOder(item.getQuantityOder() + quantity);
								check = true;
							}
						}
						// nếu sản phẩm không tồn tại thì thêm mới
						if(check == false) {
							ProductModel product__cart = new ProductModel();
							product__cart.setId(product.getId());
							product__cart.setTitle(product.getTitle());
							product__cart.setImage(product.getImage());
							product__cart.setPrice(product.getPrice());
							product__cart.setQuantity(product.getQuantity());
							product__cart.setQuantityOder(quantity);
							
							listItem.add(product__cart);	
						
						}
						session.setAttribute("cart_item", cart_item);
					}
				}
				
			}
			response.sendRedirect(request.getContextPath() + "/gio-hang?action=cart");
```
  - Cách 2: Sử dụng HashMap:
```
String pId = req.getParameter("pid");
		Product product = productDao.getId(Integer.parseInt(pId));

		HttpSession session = req.getSession();
		Object obj = session.getAttribute("cart");// luu tam vao session
		if (obj == null) {// tao moi
			// Tao mat hang
			BillProduct billProduct = new BillProduct();
			billProduct.setProduct(product);
			billProduct.setQuantity(1);
			billProduct.setUnitPrice(product.getPrice());
			// gio hang co nhieu mat hang
			Map<String, BillProduct> map = new HashMap<>();
			map.put(pId, billProduct);// them mat hang vao ds

			session.setAttribute("cart", map);// luu tam vao session
		} else {
			Map<String, BillProduct> map = (Map<String, BillProduct>) obj;

			BillProduct billProduct = map.get(pId);

			if (billProduct == null) {
				billProduct = new BillProduct();
				billProduct.setProduct(product);
				billProduct.setQuantity(1);
				billProduct.setUnitPrice(product.getPrice());

				map.put(pId, billProduct);
			} else {

				billProduct.setQuantity(billProduct.getQuantity() + 1);
			}

			session.setAttribute("cart", map);// luu tam vao session
		}

		resp.sendRedirect(req.getContextPath() + "/cart");
```
