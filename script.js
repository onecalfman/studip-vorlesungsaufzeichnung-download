function studipDownloadCreateButton(series, name, url, i) {
	url = url.replace("https://studip.tu-braunschweig.de", "https://opencast-present.rz.tu-bs.de");;

	button = document.createElement('button');
	button.setAttribute('onclick', 'location.href=' + url);
	button.setAttribute('type', 'button');
	button.innerText = ("Download: " + name);

	document.getElementsByClassName("oce_list list")[0].children[i].appendChild(button);
	button.onclick = function(){
		window.open(url)
	};
}

function studipDownloadParseData(res,i) {

		var videoNum = 0;

		if ( res["search-results"]["result"]["mediapackage"]["media"]["track"][0]["video"]["bitrate"] <= res["search-results"]["result"]["mediapackage"]["media"]["track"][1]["video"]["bitrate"]) {
			videoNum = 1;
		} else {
			videoNum = 0;
		}

		series = res["search-results"]["result"]["mediapackage"]["seriestitle"]
		name = res["search-results"]["result"]["mediapackage"]["title"]
		url = res["search-results"]["result"]["mediapackage"]["media"]["track"][videoNum]["url"]

		studipDownloadCreateButton(series, name, url, i);
}

async function studipDownloaderGetData() {
	var episodes = document.getElementsByClassName("oce_list list")[0].children;
	
	for(let i = 0; i < episodes.length; i++) {
		url = "https://studip.tu-braunschweig.de/search/episode.json?id=" + episodes[i].id
		fetch(url)
  		.then(response => response.json())
  		.then(data => studipDownloadParseData(data,i));
	}
}

studipDownloaderGetData();
