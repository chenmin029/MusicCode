/**
 * 歌曲处理
 */
class Song{	
	
	getSong(index){
		let song = musicData[index];
		return song;
	}
	getSongs($ele){
		$ele.empty();
		musicData.forEach(function(item,index){
			let li = $(`<li>${item.song}   ${item.singer}</li>`);
			$ele.append(li);
		});
	}
}
export default Song;