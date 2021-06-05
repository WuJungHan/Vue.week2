//config
const url = 'https://vue3-course-api.hexschool.io/'; // 請加入站點
//const url = 'http://localhost:3000/admin/signin/'
const path = 'eva29485577'; // 請加入個人 API Path

//取得dom
const loginBtn = document.querySelector('#loginBtn');
const loginEmail = document.querySelector('#loginEmail');
const loginPassword = document.querySelector('#loginPassword');
const loginStatusText = document.querySelector('#loginStatusText');
const checkEmail = document.querySelector('#emailHelp');
const checkPassword = document.querySelector('#passwordHelp');


const app={
  data:{
    loginStatus:'',//宣告空字串
  },
  //登入函式
  login(event) {
  event.preventDefault();//如果事件可以被取消，就取消事件（即取消事件的預設行為）。 但不會影響事件的傳遞，事件仍會繼續傳遞。在這邊是取消submit提交表單
  const username = loginEmail.value;
  const password = loginPassword.value;
  if (app.checkPass()) {//checkPass() return hasValue=true的話
    const user = {//組成user物件
      username,
      password
    }
    //console.log(user);//驗證取得loginEmail.value , loginPassword.value
    app.axiosLogin(user)//呼叫axiosLogin()函式 帶入參數user
  } else if(app.checkPass()==false){//checkPass() return hasValue=false的話
      return//中斷函式
  }

  },
  //驗證帳號密碼是否有輸入
  checkPass() {
  let hasValue;//初始化 
  if (loginEmail.value !== '') {//如果loginEmail.value不等於空字串
    username = loginEmail.value;//取出輸入的帳號
    checkEmail.textContent = ``;//將checkEmail清空
  } else {//不然
    checkEmail.textContent = `please enter your account`;//checkEmail寫上字串
  }

  if (loginPassword.value !== '') {//如果loginPassword.value不等於空字串
    password = loginPassword.value;//取出輸入的密碼
    checkPassword.textContent = ``;//將checkPassword清空
  } else {//不然
    checkPassword.textContent = `please enter your password`;//checkPassword寫上字串
  }

  if (loginEmail.value !== '' && loginPassword.value !== '') {
    hasValue = true;
  } else {
    hasValue = false;
  }
  //console.log(hasValue);//驗證
  return hasValue  //回傳hasValue布林值 做為login()的判斷
  },
  //驗證帳號密碼是否正確 顯示登入狀態函式
  renderLoginStatus() {
  if (loginStatus == '登入成功') {//如果res.data.message='登入成功'
    loginStatusText.innerHTML = `<p id="loginStatusText" class="text-warning text-center mb-2 fs-5 loginStatusTextBg NotoSansTC">${loginStatus}!3秒後跳轉至管理頁面!</p>`;//塞入html
    setTimeout(turnProductsPage, 3000);//計時器 延遲3秒執行turnProductsPage函式
    function turnProductsPage() {//轉頁面函式
      window.location = 'products.html';//轉至同層products.html
    }
  } else {
    loginStatusText.innerHTML = `<p id="loginStatusText" class="text-warning text-center mb-2 fs-5 loginStatusTextBg NotoSansTC">${loginStatus}!帳號或密碼有誤!</p>`;
  }
  loginPassword.value = '';//清空密碼欄位
  },
  //axios 登入
  axiosLogin(user) {
  //發送 API 至遠端並登入（並儲存 Token）
  //登入及驗證 - 登入 發送post請求 加上url 並在參數加上user(username password) 去做登入
  //api:/admin/signin
  axios.post(`${url}admin/signin`, user)
    .then(res => {//回傳
      //console.log(res);//驗證登入是否成功 data.message 狀態顯示
      loginStatus = res.data.message;//登入失敗或成功
      //console.log(loginStatus)//驗證
      this.renderLoginStatus();//執行renderLoginStatus函式
      //登入成功後 expired=到期日 token=憑證 (到期日過憑證就無使用) uid=實際儲存在後端使用的身分
      //const token = res.data.token;//取出token憑證
      //const expired=res.data.expired;//取出expired到期日
      const { token, expired } = res.data;//解構寫法 同上兩行 更為精簡
      //onsole.log(token,expired);//驗證
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;//儲存token跟expired到本地cookie,new Date(expired)可以將expired轉成日期格式
    })
    .catch((error) => {//接收錯誤回傳
      // handle error
      console.log(error);
    });
  },
  init(){
  loginBtn.addEventListener('click', this.login);
  }
}
app.init();