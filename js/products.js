//config
const url = "https://vue3-course-api.hexschool.io/"; // 請加入站點
//const url = 'http://localhost:3000/admin/signin/'
const path = "eva29485577"; // 請加入個人 API Path

//dom
const checkLoginBtn = document.querySelector("#checkLoginBtn");
const getProductsListBtn = document.querySelector("#getProductsListBtn");
const productsList = document.querySelector("#productsList");
const productsCount = document.querySelector("#productsCount");
const loginStatusText = document.querySelector("#loginStatusText");

//宣告空陣列
let productsData = [];

//取得 Token（Token 僅需要設定一次） test2替換成hexToken
//defaults.headers.common['Authorization']
const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);
console.log(token);

//登入及驗證-檢查用戶是否仍持續登入  //api: api/user/check
checkLoginBtn.addEventListener("click", checkLogin);
function checkLogin(params) {
  // 取得 Token（Token 僅需要設定一次）已在上方全域設定
  //console.log(token);//驗證是否有取得儲存的token
  axios.defaults.headers.common["Authorization"] = token; //把token加到header內
  // 確認是否登入
  axios.post(`${url}api/user/check`).then((res) => {
    console.log(res); //驗證是否登入 res.data.success: true
    if (res.data.success == true) {
      //如果回傳登入狀態=true
      loginStatusText.innerHTML = `<span class="pattaya">click login complete!</span> 可取得產品列表`; //提示文字
    } else {
      loginStatusText.innerHTML = `<span class="pattaya">click login complete!</span>`; //提示文字
    }
  });
}

//取得後台產品資料
getProductsListBtn.addEventListener("click", getProducts);
function getProducts() {
  // 取得 Token（Token 僅需要設定一次）已在上方全域設定
  // 取得後台產品列表
  axios
    .get(`${url}api/${path}/admin/products`) //資料庫每個人path是獨立的
    .then((res) => {
      console.log(res); //驗證 取得產品列表res.data.products
      if (res.data.success == true) {
        productsData = res.data.products; //將空陣列賦與後台products資料
        //console.log(productsData);//驗證
        loginStatusText.textContent = "產品資料如下:";
        renderProductsList();
      } else {
        //console.log(productsData);//驗證
        loginStatusText.textContent = "請重新登入!3秒後轉移至登入頁面!";
        setTimeout(turnLoginPage, 3000); //計時器 延遲3秒執行turnLoginPage函式
        function turnLoginPage() {
          //轉移至LoginPage函式
          window.location = "login.html";
        }
      }
    });
}

//渲染產品畫面
function renderProductsList() {
  let str = "";

  productsData.forEach((item) => {
    //console.log(item);//驗證
    str += `
    <tr class="text-center fs-4 productsListBg border-bottom border-light border-1">
          <td>${item.title}</td>
          <td width="120">
            <img src="${item.imageUrl}" alt="">
          </td>
          <td width="120">
            ${item.origin_price}
          </td>
          <td width="120">
            ${item.price}
          </td>
          <td width="100">
            <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="${item.id}" ${item.is_enabled == 1 ? "checked" : ""
      } data-action="status" data-id="${item.id}">
          <label class="form-check-label" for="${item.id}">${item.is_enabled == 1 ? "啟用" : "未啟用"
      }</label>
        </div>
          </td>
          <td width="120">
            <button type="button" class="btn btn-sm btn-outline-danger move delProductsBtn w-100" data-action="remove" data-id="${item.id
      }"> 刪除 </button>
          </td>
        </tr>`;
  });
  //console.log(str);
  //console.log(productsData.length);
  productsList.innerHTML = str;
  productsCount.textContent = productsData.length;

  deleteProducts(); //呼叫刪除產品函式
}

//刪除產品 需用到id來判別選到的產品品項
//管理控制台 [需驗證]-刪除產品
//api/:api_path/admin/product/:product_id
//delProductsBtn.addEventListener('click', removeProduct)
function deleteProducts() {
  //刪除單產品函式
  const delProductsBtn = [...document.querySelectorAll(".delProductsBtn")];//將.delProductsBtn的nodelist(like ary),展開成陣列
  //console.log(delProductsBtn);//驗證
  let productsId = "";
  let productsIdAry = [];
  delProductsBtn.forEach((item) => {
    productsId = item.dataset.id;
    productsIdAry.push(productsId);

    item.addEventListener("click", () => {
      productsIdAry.forEach((item,i) => {
        if (item == productsId) {
          if (window.confirm("你確定要刪除嗎？")) {
            //console.log('示範用');//驗證選取確定
            // 刪除一個產品
            axios
              .delete(`${url}api/${path}/admin/product/${item}`)
              .then((res) => {
                //console.log(res);//驗證
                getProducts();
                loginStatusText.innerHTML = `<span class="pattaya">delete complete!</span>`; //提示文字
              });

          }
          //console.log('選的好');//驗證選取取消
          loginStatusText.innerHTML = `<span class="pattaya">cancel delete!</span>`; //提示文字
        }
      });
    });
  });
  //console.log(productsIdAry);//驗證用
}

/* <span class="${item.is_enabled ? 'text-success' : 'text-secondary'}">${item.is_enabled ? '啟用' : '未啟用'}</span> */
