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


const app = {
  data: {
    productsData: [],
  },
  //登入及驗證-檢查用戶是否仍持續登入  //api: api/user/check
  checkLogin() {
  // 確認是否登入
  axios.post(`${url}api/user/check`)
    .then((res) => {
      //console.log(res); //驗證是否登入 res.data.success: true
      if (res.data.success) {//=true
        //如果回傳登入狀態=true
        loginStatusText.innerHTML = `<span class="pattaya">click login complete!</span> 可取得產品列表`; //提示文字
      } else {
        loginStatusText.innerHTML = `<span class="pattaya">click login complete!</span>`; //提示文字
      }
    })
    .catch((error) => {//接收錯誤回傳
      // handle error
      console.log(error);
    });
  
  },
  //取得後台產品資料
  getProducts() {
    // 取得 Token（Token 僅需要設定一次）已在上方全域設定
    // 取得後台產品列表
    axios.get(`${url}api/${path}/admin/products`) //資料庫每個人path是獨立的
      .then((res) => {
        //console.log(res); //驗證 取得產品列表res.data.products
        if (res.data.success) {//=true
          productsData = res.data.products; //將空陣列賦與後台products資料
          //console.log(productsData);//驗證
          loginStatusText.textContent = "產品資料如下:";
          app.renderProductsList();//呼叫渲染函式
        } else {
          //console.log(productsData);//驗證
          loginStatusText.textContent = "請重新登入!3秒後轉移至登入頁面!";
          setTimeout(turnLoginPage, 3000); //計時器 延遲3秒執行turnLoginPage函式
          function turnLoginPage() {
            //轉移至login.html
            window.location = "login.html";
          }
        }
      })
      .catch((error) => {//接收錯誤回傳
        // handle error
        console.log(error);
      });
  },
  //渲染產品畫面
  renderProductsList() {
    let template = "";//初始化空字串
    productsData.forEach((item) => {//將res.data.products跑forEach
      //console.log(item);//驗證
      template += `
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
          ${item.is_enabled == 1 ? "啟用" : "未啟用"}
          </td>
          <td width="120">
            <button type="button" class="btn btn-sm btn-outline-danger move delProductsBtn w-100" data-action="remove" data-id="${item.id
        }"> 刪除 </button>
          </td>
        </tr>`;
    });
    //console.log(template);
    //console.log(productsData.length);
    productsList.innerHTML = template;//將字串塞入productsList
    productsCount.textContent = productsData.length;//將productsData長度(資料筆數) 寫上productsCount
    
    this.deleteProducts();
  },
  //刪除產品 需用到id來判別選到的產品品項
  //管理控制台 [需驗證]-刪除產品
  //刪除產品 需用到id來判別選到的產品品項
  deleteProducts() {
  //刪除單產品函式
  const delProductsBtn = [...document.querySelectorAll(".delProductsBtn")];//將.delProductsBtn的nodelist(like ary),展開成陣列

  //console.log(delProductsBtn);//驗證

  delProductsBtn.forEach((item) => {//item=.delProductsBtn
    let productsId = "";//初始化空字串
    let productsIdAry = [];//初始化空陣列
    productsId = item.dataset.id;
    productsIdAry.push(productsId);

    item.addEventListener("click", () => {//當按鈕被點擊
      productsIdAry.forEach((item) => {//item=productsIdAry
        if (item == productsId) {//如果productsIdAry內的資料=productsId時
          if (window.confirm("Are you sure to delete the product?") == true) {//彈跳選擇視窗
            //console.log('nice');//驗證選取確定
            // 刪除一個產品
            axios
              .delete(`${url}api/${path}/admin/product/${productsId}`)
              .then((res) => {
                //console.log(res);//驗證
                this.getProducts();//呼叫取得產品資料函式 並重新渲染畫面
                loginStatusText.innerHTML = `<span class="pattaya">delete complete!</span>`; //提示文字
              });

          } else {
            //console.log('選的好');//驗證選取取消
            loginStatusText.innerHTML = `<span class="pattaya">cancel delete!</span>`; //提示文字
          }

        }
      });
    });
  });
  //console.log(productsIdAry);//驗證用
  },
  init() {
  //取出cookie 
    //取得 Token 已在login頁面儲存（Token 僅需要設定一次） test2替換成hexToken
    //defaults.headers.common['Authorization']
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;

    checkLoginBtn.addEventListener("click", this.checkLogin);
    getProductsListBtn.addEventListener("click", this.getProducts);
  }
}
app.init();