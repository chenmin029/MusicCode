/**
 * 用户登录处理
 */
class Login{
	checkLogin(){
		let result = {};
		let userName = window.localStorage.getItem('userName');
		// console.log(userName);
		if (userName){
			result = {login:true,username:userName};
		} else {
			result = {login:false,username:userName};
		}
		return result;
	}
	login(userName,password){
		let result = {};
		let success = false;
		let error = "";
		for (let item of users) {
			// console.log(item.name,item.pwd);
			if (item.name == userName){
				if (item.pwd == password){
					success = true;
					break;
				} else {
					error = "密码错误";
				}
			} else {
				error = "用户名错误";
			}
			
		}
		return {login:success,msg:error};
	}
}
export default Login;