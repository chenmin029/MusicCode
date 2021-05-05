/**
 * 歌词处理
 */
class Lyric{
	
	getLyric(song,$ele){
		let lyric = song.lyric;
		let lyricArr = [];
		
		lrcs.forEach((item,index)=>{
			if (item.song == lyric){
				lyricArr = item.lyric;
			}
		});
			
		
		//加载歌词
		$ele.empty();
		for (let item of lyricArr){
			let li = $(`<li time=${item.time}>${item.lineLyric}</li>`);
			$ele.append(li);
		}
	}
}
export default Lyric;