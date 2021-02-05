const studip_url = window.location.origin
const opencast_url = 'https://opencast-present.rz.tu-bs.de'


if(document.URL.includes("courseware")) { coursewareDownloaderGetData() }
else { studipDownloaderGetData(); }

async function studipDownloaderGetData() {
	var episodes = document.getElementsByClassName("oce_list list")[0].children;
	
	for(let i = 0; i < episodes.length; i++) {
		url = studip_url + '/search/episode.json?id=' + episodes[i].id
		fetch(url)
  		.then(response => response.json())
  		.then(data => studipDownloadParseData(data,i));
	}
}

async function coursewareDownloaderGetData() {
	let i=0
	id=document.getElementsByTagName("iframe")[0].src.match(/id=(.*)&/)[1]
	if(! id.includes('-')) {
		setTimeout(coursewareDownloaderGetData, 500);
		return;
	}
	url = studip_url + '/search/episode.json?id=' + id;
	fetch(url)
  	.then(response => response.json())
  	.then(data => studipDownloadParseData(data,i));
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

function studipDownloadCreateButton(series, name, url, i) {
	url = url.replace(studip_url, opencast_url);

	button = document.createElement('button');
	button.setAttribute('onclick', 'location.href=' + url);
	button.setAttribute('type', 'button');
	button.innerText = ("Download: " + name);

	if(document.URL.includes("courseware")) {
		document.getElementsByClassName('block-content')[0].appendChild(button);
	}
	else {
		document.getElementsByClassName("oce_list list")[0].children[i].appendChild(button);
	}
	button.onclick = function(){
		window.open(url)
		//var downloading = browser.downloads.download({
  		//	url : url,
  		//	filename : name,
  		//	conflictAction : 'uniquify'
		//});
	};
}
