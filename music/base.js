/**
 * 基础模块
 */
import Comments from "./comments.js";
import Login from "./login.js";
import Lyric from "./lyric.js";
import Song from "./song.js";
import Playhistory from './playHistory.js'
class Base{
	constructor() {
	    this.Song = new Song();
		this.Comments = new Comments();
		this.Playhistory = new Playhistory();
		this.Lyric = new Lyric();
		this.Login = new Login();
		
		this.playModel = ['顺序模式','随机模式','单曲循环','全部循环'];
		this.playModelIndex = 0;
		
		this.logined = false;
		
		
		this.initPage();
		this.initEvent();
		
		
	}
	//更新界面
	updateUI(currSong){
		// console.log(currSong);
		let {song,album,singer,source,url,lyric,msg} = currSong;
		$('audio').attr('src',url);
		$('.song p').text(song);
		$('.song span').eq(0).text('专辑：'+album);
		$('.song span').eq(1).text('歌手：'+singer);
		$('.song span').eq(2).text('来自：'+source);
		
		//获取歌词
		this.Lyric.getLyric(currSong,$('.lyric ul'));
		//获取评论
		this.Comments.getComments(msg,$('.comments ul'));
	}
	//获取歌词
	getLyric(currSong){
		this.Lyric.getLyric(currSong,$('.lyric ul'));
	}
	
	//声音控制函数
	volCtrl(){		
		this.myAudio.volume = $('#rangInputVol').val();
		if ($('#rangInputVol').val() == 0){
			$('#volOrnot').removeClass('icon-bofang');
			$('#volOrnot').addClass('icon-icon-');
		} else {
			$('#volOrnot').removeClass('icon-icon-');
			$('#volOrnot').addClass('icon-bofang');
		}
	}
	//根据播放模式选择歌曲
	selectSong(model){		
		switch(this.playModelIndex){
			case 0:
				//顺序播放				
				//下一首
				this.songIndex++;
				//如果是最后一首，停止播放
				if (this.songIndex >= musicData.length){
					this.songIndex--;
					//停止播放
					//光盘停止转动
					$('.bigArc').addClass('stop');
					
					//播放按钮变化
					$('#playAndpause').removeClass('icon-weibiaoti--');
					$('#playAndpause').addClass('icon-bofang1');
					$('#playProgress').val(0);
				}
				return this.songIndex;
				break;
			case 1:
				//随机模式
				this.songIndex = parseInt(Math.random()*3);
				return this.songIndex;
				break;
			case 2:
				//单曲循环
				return this.songIndex;
				break;
			case 3:
				//全部循环				
				//下一首
				this.songIndex++;
				//如果是最后一首，停止播放
				if (this.songIndex >= musicData.length){
					this.songIndex = 0;
				}				
				return this.songIndex;
				break;
		}
	}
	//初始化界面
	initPage(){
		this.songIndex = 0;
		this.payHistory = [];
		this.myAudio = $('audio').get(0);
		$('#rangInputVol').val(0.5)
		$('.bigArc').addClass('stop');
		$('#mycolor').val('#FF0000');
		$('#playModelCtrl').text(this.playModelIndex);
		$('#playModelCtrl').attr('title',this.playModel[this.playModelIndex]);
		//初始化播放列表
		this.Song.getSongs($('.playing ul'));
		//获得第一首歌
		let currSong = this.Song.getSong(this.songIndex);
		this.updateUI(currSong);
		//加入历史
		if (!this.Playhistory.checkHistory(this.payHistory,currSong)){
			this.Playhistory.addHistory(this.payHistory,currSong,$('.playHistory ul'));
		}
		$('.playing ul li').removeClass('bk');
		$('.playing ul li').eq(this.songIndex).addClass('bk');
		
		let loginResult = this.Login.checkLogin();
		if (loginResult.login){
			// this.logined = true;
			$('#loginUsr').text(loginResult.username);
		}
	}
	//时间转成时分秒
	formatTime(s) { 
			var s = Math.floor(s); 
			var h = Math.floor(s / 3600); 
			var m = Math.floor(s % 3600 / 60); 
			var s = s % 60;
			return (h > 0 ? (h + ":") : "") + (m + ":") + (s > 9 ? s : ("0" + s))
	}
	//设置歌曲
	setSong(){
		let currSong = this.Song.getSong(this.songIndex);			
		this.updateUI(currSong);			
		this.myAudio.play();
		//加入历史
		if (!this.Playhistory.checkHistory(this.payHistory,currSong)){
			this.Playhistory.addHistory(this.payHistory,currSong,$('.playHistory ul'));
		}
		$('.playing ul li').removeClass('bk');
		$('.playing ul li').eq(this.songIndex).addClass('bk');
		
		$('#playAndpause').removeClass('icon-bofang1');
		$('#playAndpause').addClass('icon-weibiaoti--');
		
		$('.bigArc').removeClass('stop');
	}
	
	initEvent(){
		this.myAudio.oncanplaythrough = ()=>{
			$('#endtime').text(this.formatTime(this.myAudio.duration));
			$('#playProgress').attr('max',Math.floor(this.myAudio.duration));
		}
		
		this.myAudio.onended = ()=>{
			//需要根据播放模式确定播放哪首歌,目前先定义为循环播放
			this.songIndex = this.selectSong();
			this.setSong();
		}
		
		this.myAudio.ontimeupdate = ()=>{
			
			//加载完成后    时间的加载
			$('#begintime').text(this.formatTime(this.myAudio.currentTime));
			$('#playProgress').val(Math.floor(this.myAudio.currentTime));
			//歌词滚动
			let time = Math.ceil(this.myAudio.currentTime);
			let lyricLis = $('.lyric ul li');
			for (let item of lyricLis){
				var cTime = $(item).attr('time');
				if (cTime == time){
					lyricLis.removeClass('red');
					$(item).addClass('red');
					$('.lyric')[0].scrollTop = ($(item).index() - 5) * 30;
				}
			}
		};
		//拖动改变播放时间range的事件
		$('#playProgress').on('mousedown',()=>{
			this.tempPaused = false;
			if (this.myAudio.paused){
				this.tempPaused = true;
			} else {
				this.tempPaused = false;
			}
			this.myAudio.pause();
		})
		$('#playProgress').on('change',()=>{
			this.myAudio.currentTime = $('#playProgress').val();
			$('#begintime').text($('#playProgress').val());
			if (this.tempPaused == false){
				this.myAudio.play();
			} 
		})
		//播放暂停事件
		$('#playAndpause').click(()=>{
			if ($(playAndpause).hasClass('icon-bofang1')){
				//开始播放
				this.myAudio.play();
				$('#playAndpause').removeClass('icon-bofang1');
				$('#playAndpause').addClass('icon-weibiaoti--');
				$('.bigArc').removeClass('stop');
			} else {
				//暂停播放
				this.myAudio.pause();
				//光盘停止转动
				$('.bigArc').addClass('stop');				
				//播放按钮变化
				$('#playAndpause').removeClass('icon-weibiaoti--');
				$('#playAndpause').addClass('icon-bofang1');
			}
		})
		//下一首
		$('#nextSong').on('click',()=>{
			//不根据播放模式确定播放哪首歌,相当于全部循环
			this.songIndex++;
			if (this.songIndex > 3){
				this.songIndex = 0;
			}
			this.setSong();
		})
		//上一首
		$('#prevSong').on('click',()=>{
			//不根据播放模式确定播放哪首歌,相当于全部循环
			this.songIndex--;
			if (this.songIndex < 0){				
				this.songIndex = 3;				
			}
			this.setSong();
		})
		//显示播放列表
		$('.icon-liebiao').on('click',()=>{
			$('.cover').show();
			$('.playInfo').show();
		})
		//关闭播放列表
		$('#closePlayInfo').on('click',()=>{
			$('.cover').hide();
			$('.playInfo').hide();
		})
		//显示播放列表
		$('#playlist').on('click',()=>{
			$('.playing').show();
			$('.playHistory').hide();
			
			$('#playlist').addClass("colorbl");
			$('#playhis').removeClass("colorbl");
		})
		//显示播放历史
		$('#playhis').on('click',()=>{
			$('.playing').hide();
			$('.playHistory').show();
			
			$('#playlist').removeClass("colorbl");
			$('#playhis').addClass("colorbl");
		})
		
		//声音大小控制事件
		$('#rangInputVol').on('input',()=>{
				this.volCtrl();
		})
		
		//声音静音控制
		$('#volOrnot').on('click',()=>{
			if ($('#volOrnot').hasClass('icon-bofang')){
				this.myAudio.volume = 0;
				$('#volOrnot').removeClass('icon-bofang');
				$('#volOrnot').addClass('icon-icon-');
			} else {
				this.myAudio.volume = $('#rangInputVol').val();
				$('#volOrnot').removeClass('icon-icon-');
				$('#volOrnot').addClass('icon-bofang');
			}
			
		})
		//从播放列表选择要播放的歌曲
		let that = this;
		$('.playing ul').on('click','li',function(){
			that.songIndex = $(this).index();
			that.setSong();
		})
		//播放模式选择
		$('#playModelCtrl').on('click',()=>{
			this.playModelIndex++;
			if (this.playModelIndex > 3){
				this.playModelIndex = 0;
			}
			$('#playModelCtrl').text(this.playModelIndex);
			$('#playModelCtrl').attr('title',this.playModel[this.playModelIndex]);
		})
		//选择播放历史
		$('.playHistory ul').on('click','li',function(){
			let songName = ($(this).text()).split('--')[0];
			this.songIndex = that.Playhistory.getHistoryIndex(songName);
			that.setSong();
		})
		//更换皮肤
		$('#mycolor').on('change',()=>{
			let customColor = $('#mycolor').val();
			$('.top').css('background-color',customColor);
			$('.bottom').css('background-color',customColor);
		})
		//关闭登录
		$('#loginClose').on('click',()=>{
			$('.cover').hide();
			$('.login').hide();
			return false;
		})
		//打开登录窗口
		$('.icon-denglu').on('click',()=>{
			console.log(this.logined);
			if (this.logined){
				alert('已经登录了');
				return;
			}
			$('.cover').show();
			$('.login').show();
		})
		//登录提交
		$('#submit').on('click',()=>{			
			let remmberPwd = $('#remmberPwd').prop('checked');			
			
			let userName = $('#username').val();
			let password = $('#password').val();
			
			if (userName == ""){
				alert('请输入用户名');
				return;
			}
			
			if (password == ""){
				alert('请输入密码');
				return;
			}
			console.log(userName,password);
			let result = this.Login.login(userName,password);
			if (result.login == false){
				alert(result.msg);
				return;
			}
			
			$('#loginUsr').text(userName);
			this.logined = true;
			
			if (remmberPwd){
				window.localStorage.setItem('userName',userName);
				window.localStorage.setItem('password',password);
			} else {
				window.localStorage.removeItem('userName');
				window.localStorage.removeItem('password');
			}
			
			$('.cover').hide();
			$('.login').hide();
		})
	}
}
export default Base;