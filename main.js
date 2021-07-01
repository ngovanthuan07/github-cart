const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let products = [
  {
    product: {
      id: 1,
      image:
        "https://cdn.tgdd.vn/Files/2017/09/26/1024727/bluetooth-head-phones_800x451.jpg",
      title: "tai nghe gamming",
      inventory: 5,
      price: 5000000,
    },
    quantity: 1,
  },
  {
    product: {
      id: 2,
      image:
        "https://cdn.tgdd.vn/Files/2020/06/08/1261556/camera48mpchichupduoc12mp2_1200x674-800-resize.jpg",
      title: "dien thoai samsung",
      inventory: 10,
      price: 3000000,
    },
    quantity: 1,
  },
  {
    product: {
      id: 3,
      image: "https://cdn.tgdd.vn/2020/08/content/Untitled-1-800x450-18.jpg",
      title: "may tinh hp",
      inventory: 7,
      price: 2500000,
    },
    quantity: 1,
  },
];

let price = 1;

// let productLocation = localStorage.setItem("product", JSON.stringify(products));

let renderProduct = products.map((product) => {
  return `
    <div class="col-4 list-item-${product.product["id"]}">
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${product.product["image"]}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${product.product["title"]}</h5>
                <p class="card-text">${product.product["price"]} $</p>
                <button href="#" class="btn btn-primary" onclick="onAddToCart(${product.product["id"]})">Mua</button>
            </div>
        </div>
    </div>

      `;
});

$(".product-card").innerHTML = renderProduct.join(" ");

let productElement = $$("button");
let cart = [];
let cartGetLocalStorage = null;

let handleCurrentIndex = (codePramater) => {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].product["id"] === codePramater) {
      return i;
    }
  }
  return -1;
};

let onAddToCart = (id__Product) => {
  let objProduct = products.find((p) => p.product["id"] === id__Product);

  if (objProduct) {
    let currentIndex = handleCurrentIndex(objProduct.product["id"]);
    if (currentIndex < 0 || !cart.length) {
      cart.push(objProduct);
      localStorage.setItem("cart", JSON.stringify(cart));
      cartGetLocalStorage = localStorage.getItem("cart");
      if (cartGetLocalStorage) {
        handleCart(cartGetLocalStorage);
      }
    } else {
      cart[currentIndex].quantity += 1;
      if (
        cart[currentIndex].quantity >= cart[currentIndex].product["inventory"]
      ) {
        alert("Đã hết hàng");
        cart[currentIndex].quantity = cart[currentIndex].product["inventory"];
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      cartGetLocalStorage = localStorage.getItem("cart");
      if (cartGetLocalStorage) {
        handleCart(cartGetLocalStorage);
      }
    }
  }
};

let handleCart = (productCart) => {
  let listProduct = JSON.parse(productCart);
  price = 0; // reset price
  let cartElement = listProduct.map((productC) => {
    let productEl = productC.product;
    price +=  productEl["price"] * productC.quantity;
    return `
            <ul class="cart_list">
                <li class="cart_item clearfix">
                    <div class="cart_item_image"><img src="${
                      productEl["image"]
                    }" alt=""></div>
                    <div class="cart_item_info d-flex flex-md-row flex-column justify-content-between">
                        <div class="cart_item_name cart_info_col">
                            <div class="cart_item_title">Name</div>
                            <div class="cart_item_text">${
                              productEl["title"]
                            }</div>
                        </div>
                        <div class="cart_item_color cart_info_col">
                            <div class="cart_item_title">Color</div>
                            <div class="cart_item_text"><span style="background-color:#999999;"></span>Silver</div>
                        </div>
                        <div class="cart_item_quantity cart_info_col">
                            <div class="cart_item_title">Quantity</div>
                            <div class="cart_item_text">${
                              productC.quantity
                            }</div>
                        </div>
                        <div class="cart_item_price cart_info_col">
                            <div class="cart_item_title">Price</div>
                            <div class="cart_item_text">${
                              productEl["price"]
                            } $</div>
                        </div>
                        <div class="cart_item_total cart_info_col">
                            <div class="cart_item_title">Total</div>
                            <div class="cart_item_text">${
                              productEl["price"] * productC.quantity
                            } $</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-danger float-right" onclick="handleDeleteCart(${
                      productEl["id"]
                    })">Xoá</button>
                </li>
                
            </ul> 

        `;
  });
  $(".cart_items").innerHTML = cartElement.join("");

  handTotalPrice(price);
};
let handTotalPrice = (priceEl) => {
  $(".order_total").innerHTML = `
        <div class="order_total_content text-md-right">
        <div class="order_total_title">Order Total:</div>
        <div class="order_total_amount">${priceEl ? priceEl : 0}</div>
        </div>
`;
};

handTotalPrice(price);

let handleDeleteCart = (id) => {
  let currentIndex = handleCurrentIndex(id);
  cart.splice(currentIndex, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  cartGetLocalStorage = localStorage.getItem("cart");
  if (cartGetLocalStorage) {
    handleCart(cartGetLocalStorage);
  }
};
