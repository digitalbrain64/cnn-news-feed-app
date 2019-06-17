var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


function getFeedsArr(url){
	// results variable
	var jsonFeedsArr = null;
	var apiKey = "36vkyefajtemeunatvuxyud59n3hq0tomyzcetjr";
	
	// using rss2json api
	var rss2JsonApiLink = `https://api.rss2json.com/v1/api.json?rss_url=${url}`;

	// dowloading data from urls
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		console.log(JSON.parse(this.responseText).items);
		
		jsonFeedsArr = JSON.parse(this.responseText).items;
	  }
	};

	xhttp.open("GET", rss2JsonApiLink, true);
	xhttp.setRequestHeader("api_key", apiKey);
	xhttp.send();
	return jsonFeedsArr;
}


module.exports = {
	getFeedsArr
}