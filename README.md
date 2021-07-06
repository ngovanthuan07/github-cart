# tìm hiểu thêm

- thuật toán thêm giỏ hàng vào trong java servlet sử dụng session
  - Cách 1: sử dụng ArrayList:

```
String action = request.getParameter("action");
		if (action != null && action.equals("cart")) {
			RequestDispatcher rd = request.getRequestDispatcher("/views/web/cart/cart.jsp");
			rd.forward(request, response);
		} else {
			// them gio vao gio hang
			String productId = request.getParameter("productId");
			long id;
			if (productId != null) {
				id = Long.parseLong(productId);
				ProductModel product = productService.findOneById(id);
				if (product != null) {
					// tạo mới một session
					HttpSession session = request.getSession();
					if (session.getAttribute("cart_item") == null) {
						CartItemModel cart_item = new CartItemModel();
						List<ProductModel> listItem = new ArrayList<ProductModel>();
						// thêm 1 sản phẩm vào list
						ProductModel productByCart = new ProductModel();
						productByCart.setId(product.getId());
						productByCart.setTitle(product.getTitle());
						productByCart.setImage(product.getImage());
						productByCart.setPrice(product.getPrice());
						productByCart.setQuantity(product.getQuantity());
						productByCart.setQuantityOder(1);
						listItem.add(productByCart);

						// thiết lập list sản phẩm
						cart_item.setProduct(listItem);

						session.setAttribute("cart_item", cart_item);
					} else {
						// thêm một sản phẩm khi đã có session
						CartItemModel cart_item = (CartItemModel) session.getAttribute("cart_item");
						// lấy list sản phẩm
						List<ProductModel> listItem = cart_item.getProduct();
						boolean check = false;
						// kiểm tra sản phẩm có tồn tại trong giỏ hàng
						for (ProductModel item : listItem) {
							if (item.getId() == product.getId()) {
								// sản phẩm tồn tại thì chỉ cộng quantity thêm 1
								item.setQuantityOder(item.getQuantityOder() + 1);
								check = true;
							}
						}
						// nếu sản phẩm không tồn tại thì thêm mới
						if (check == false) {
							ProductModel productByCart = new ProductModel();
							productByCart.setId(product.getId());
							productByCart.setTitle(product.getTitle());
							productByCart.setImage(product.getImage());
							productByCart.setPrice(product.getPrice());
							productByCart.setQuantity(product.getQuantity());
							productByCart.setQuantityOder(1);

							listItem.add(productByCart);

						}
						session.setAttribute("cart_item", cart_item);
					}
				}

			}
			response.sendRedirect(request.getContextPath() + "/gio-hang?action=cart");
		}
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
