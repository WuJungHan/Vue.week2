//config
const url = 'https://vue3-course-api.hexschool.io/'; // 請加入站點
//const url = 'http://localhost:3000/admin/signin/'
const path = 'eva29485577'; // 請加入個人 API Path

//取得dom
const loginBtn=document.querySelector('#loginBtn');
const loginEmail=document.querySelector('#loginEmail');
const loginPassword=document.querySelector('#loginPassword');
const loginStatusText=document.querySelector('#loginStatusText');
const checkEmail=document.querySelector('#emailHelp');
const checkPassword=document.querySelector('#passwordHelp');

let loginStatus='';
//登入事件
loginBtn.addEventListener('click', login);
//登入函式
function login(evant) {
  event.preventDefault();//如果事件可以被取消，就取消事件（即取消事件的預設行為）。 但不會影響事件的傳遞，事件仍會繼續傳遞。在這邊是取消submit提交表單
  const username=loginEmail.value;
  const password=loginPassword.value;
  checkPass();//呼叫檢查函式
  
  const user = {//組成user物件
    username,
    password
  }
  //console.log(user);//驗證取得loginEmail.value , loginPassword.value
  stopOrKeep(user);//呼叫函式 判斷是否中斷程式碼或繼續發送post

}

//取得 Token（Token 僅需要設定一次） test2替換成hexToken
//defaults.headers.common['Authorization']
const token=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
//console.log(token);//驗證取得token

//驗證帳號密碼是否有輸入
function checkPass(){
  if(loginEmail.value!==''){//如果loginEmail.value不等於空字串
  username = loginEmail.value;//取出輸入的帳號
  checkEmail.textContent=``;//將checkEmail清空
  }else{//不然
  checkEmail.textContent=`please enter your account`;//checkEmail寫上字串
  }

  if(loginPassword.value!==''){//如果loginPassword.value不等於空字串
  password = loginPassword.value;//取出輸入的密碼
  checkPassword.textContent=``;//將checkPassword清空
  }else{//不然
  checkPassword.textContent=`please enter your password`;//checkPassword寫上字串
  }
  
}

//驗證帳號密碼是否正確 顯示登入狀態函式
function renderLoginStatus(){
  str=loginStatus;//將res.data.message當做判斷式
  if(loginStatus=='登入成功'){//如果res.data.message='登入成功'
  loginStatusText.innerHTML=`<p id="loginStatusText" class="text-warning text-center mb-2 fs-5 loginStatusTextBg NotoSansTC">${str}!3秒後跳轉至管理頁面!</p>`;//塞入html
  setTimeout(turnProductsPage,3000);//計時器 延遲3秒執行turnProductsPage函式
  function turnProductsPage(){//轉頁面函式
  window.location = 'products.html';//轉至同層products.html
  }
  }else{
  loginStatusText.innerHTML=`<p id="loginStatusText" class="text-warning text-center mb-2 fs-5 loginStatusTextBg NotoSansTC">${str}!帳號或密碼有誤!</p>`;
  }
  loginPassword.value='';//清空密碼欄位
}

//axios 登入
function axiosLogin(user){
//發送 API 至遠端並登入（並儲存 Token）
  //登入及驗證 - 登入 發送post請求 加上url 並在參數加上user(username password) 去做登入
  //api:/admin/signin
  axios.post(`${url}admin/signin`, user)
    .then(res => {//回傳
      //console.log(res);//驗證登入是否成功 data.message 狀態顯示
      loginStatus=res.data.message;//登入失敗或成功
      //console.log(loginStatus)//驗證
      renderLoginStatus();//執行renderLoginStatus函式
      //登入成功後 expired=到期日 token=憑證 (到期日過憑證就無使用) uid=實際儲存在後端使用的身分
      const token = res.data.token;//取出token憑證
      const expired=res.data.expired;//取出expired到期日
      //onsole.log(token,expired);//驗證
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;//儲存token跟expired到本地cookie,new Date(expired)可以將expired轉成日期格式
    });
}

//中斷函式
function stopOrKeep(user){
  if(loginEmail.value==''||loginPassword.value==''){//如果欄位為空字串
  return//中斷程式碼
  }else{//不然
  axiosLogin(user)//執行函式
  }
}

