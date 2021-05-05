/**
 * 评论处理接口
 */
class Comments{
	
	getComments(msg,$ele){
		$ele.empty();
		for (let item of msg){
			let li = $(`<li></li>`);
			let username = "";
			for (let user of users){
				if (user.id == item.userId){
					username = user.name;
				}
			}
			let p = $(`<p>${username}</p>`);
			li.append(p);
			let span = $(`<span>${item.date}</span>`);
			li.append(span);
			let h3 = $(`<h3>${item.megCon}</h3>`);
			li.append(h3);
			
			$ele.append(li);
		}
	}
}
export default Comments;