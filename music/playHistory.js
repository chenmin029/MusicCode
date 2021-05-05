class Playhistory{
	
	checkHistory(historyArr,song){
		let had = false;
		for (let item of historyArr){
			if (song.song == item){
				had = true;
			}
		}
		return had;
	}
	addHistory(historyArr,song,$ele){
		historyArr.push(song.song);
		let li = $(`<li>${song.song}--${song.singer}</li>`);
		$ele.append(li);
	}
	getHistoryIndex(songName){
		let index = 0;
		for (let item of musicData) {
			if (item.song == songName){
				index = item.id - 1;
				break;
			}
		}
		return index;
	}
}
export default Playhistory;