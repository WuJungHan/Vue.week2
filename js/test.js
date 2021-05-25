const url = 'https://vue3-course-api.hexschool.io/'; // 請加入站點
const path = 'eva29485577'; // 請加入個人 API Path

// #1 如何串接 API 資料 
//客戶購物 [免驗證] - 取得商品列表 發送get請求 代入自己的url path
///api/:api_path/products
axios.get(`${url}api/${path}/products`)
  .then(res => {//接收回應
    console.log(res);
  })

//取得dom
const emailInput = document.querySelector('#email');
const pwInput = document.querySelector('#password');
const loginBtn = document.querySelector('#login');
const checkBtn = document.querySelector('#check');
const getProductsBtn = document.querySelector('#getProducts');
const addProductBtn = document.querySelector('#addProduct');
const delProductBtn = document.querySelector('#delProduct');
const fileInput= document.querySelector('#file');

//登入
loginBtn.addEventListener('click', login);

function login() {
  const username = emailInput.value;
  const password = pwInput.value;

  const user = {
    username,
    password
  }

  // #2 發送 API 至遠端並登入（並儲存 Token）
  //console.log(user);//驗證取得輸入的emailInput.value pwInput.value
  //登入及驗證 - 登入 發送post請求 加上url 並在參數加上user(username password) 去做登入
  ///admin/signin
  axios.post(`${url}admin/signin`, user)
    .then(res => {
      console.log(res);//驗證登入是否成功 data.message 狀態顯示
      //登入成功後 expired=到期日 token=憑證 (到期日過憑證就無使用) uid=實際儲存在後端使用的身分
      const token = res.data.token;//取出token憑證
      const expired=res.data.expired;//取出expired到期日
      //onsole.log(token,expired);//驗證
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;//儲存token跟expired到本地cookie,new Date(expired)可以將expired轉成日期格式
    });
}

//取得 Token（Token 僅需要設定一次） test2替換成hexToken
//defaults.headers.common['Authorization']
const token=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
console.log(token);




//登入及驗證-檢查用戶是否仍持續登入  //api/user/check
checkBtn.addEventListener('click', checkLogin);
function checkLogin(params) {
  // #3 取得 Token（Token 僅需要設定一次）已在上方全域設定
  //console.log(token);//驗證是否有取得儲存的token
  axios.defaults.headers.common['Authorization']=token;//把token加到header內
  // #4  確認是否登入
  axios.post(`${url}api/user/check`)
  .then(res=>{
    console.log(res);//驗證是否登入 res.data.success: true
  })
}

//管理控制台 [需驗證]-取得商品列表 ///api/:api_path/admin/products
getProductsBtn.addEventListener('click', getProducts)
function getProducts() {
  //取得 Token（Token 僅需要設定一次）已在上方全域設定
  // #5 取得後台產品列表
  axios.get(`${url}api/${path}/admin/products`)//資料庫每個人path是獨立的
  .then(res=>{
    console.log(res);//驗證 取得產品列表res.data.products
  })
}


//新增產品
//管理控制台 [需驗證]-商品建立 //api/:api_path/admin/product
addProductBtn.addEventListener('click', addProduct)
function addProduct() {

  //要post到伺服器儲存的資料結構
  const product = {
    data: {
      title: '[賣]動物園造型衣服3',
      category: '衣服2',
      origin_price: 100,
      price: 300,
      unit: '個',
      description: 'Sit down please 名設計師設計',
      content: '這是內容',
      is_enabled: 1,
      imageUrl: 'https://images.unsplash.com/photo-1573662012516-5cb4399006e7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80'
    }
  }

  // #6 新增一個產品 代入api與product
  axios.post(`${url}api/${path}/admin/product`,product)
  .then(res=>{
    console.log(res);
  })
}


//刪除產品 需用到id來判別選到的產品品項
//管理控制台 [需驗證]-刪除產品
//api/:api_path/admin/product/:product_id
delProductBtn.addEventListener('click', removeProduct)
function removeProduct() {

  const id='-MaOYmUgkAzuKUSzorSU';
  // #7 刪除一個產品
  axios.delete(`${url}api/${path}/admin/product/${id}`)
  .then(res=>{
    console.log(res);
  })
}

//管理控制台 [需驗證]-上傳圖片
fileInput.addEventListener('change',upload);
function upload(){
//console.dir(fileInput.files[0])//可抓取dom元素所有的內容 裡面有個files陣列屬性 可以找到丟上去的檔案的index
const file=fileInput.files[0];//抓出需上傳的檔案資訊
const formData=new FormData();//使用formData格式來上傳檔案 會將資料轉成類似傳統表單的方式進行發送 建立一個新的 FormData 格式，也就是我們 HTML 中常用的 <form></form> 標籤，他實際上的格式回傳給後端的格式
formData.append('file-to-upload',file);//增加欄位 file-to-upload在<input type="file" name="file-to-upload">得知,以及對應檔案file 用 formData.append() 這個方法，來對 formData 格式插入一個新的欄位，我們程式碼中插入的欄位就是圖片相關設定

//開始進行上傳檔案
///api/thisismycourse2/admin/upload
axios.post(`${url}api/${path}/admin/upload`, formData)
.then(res => {
console.log(res);//驗證上傳是否成功
console.log(res.data.imageUrl);//驗證上傳後 圖片網址
const imageUrlUp=res.data.imageUrl;//抓取出上傳後 圖片網址
})
}

/*"https://storage.googleapis.com/vue-course-api.appspot.com/eva29485577/1621827722840.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=YSgCQ%2BmXwi8CuFzf9RSFR%2FNQhFojcN90HQjYgpR9h999fF%2BPVUVxAtb4iUFDr9k1EfVbOMa9bW%2F89W7CLFkEm1O5ZJBQzdUZ5tdRvJa23xuP1jOCBxJs8SaDmkS4bFpzHqk%2Fpz5D%2B0g2695vcA%2FT9MY4hgx64sNaLbHGcepWI%2BLAi6IlD7HSTHowXboeHDQBbldMt8NFT2w3iel4BAb3%2Byj0EZiYm82DbjSsnj2Y23N1kJyT5S4EAnEh4ytgICqlBckxJ2VgQKpCrhr21fssjGhzISa7zgR02V7PTNNi48CFHNxcHwUDhYY2jAFo0I%2B9r%2Fw557iLdnHwAg7GO3h83A%3D%3D"*/ 