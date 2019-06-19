// sPath is current html filename with '/' at the start
var sPath = window.location.pathname;

// substring filename with no '/'
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

// api keys
var rss2JsonApiKey = "36vkyefajtemeunatvuxyud59n3hq0tomyzcetjr";
var openWeatherApiKey = "dd600a6f3524bad742db42efe5147d7e";
var reverseGeoCodingApiKey = "e2385fa5e79744";

// array of rss links needed for global search function
var rssLinks = ["http://rss.cnn.com/rss/edition.rss","http://rss.cnn.com/rss/edition_world.rss","http://rss.cnn.com/rss/edition_technology.rss",
"http://rss.cnn.com/rss/edition_meast.rss","http://rss.cnn.com/rss/edition_space.rss","http://rss.cnn.com/rss/edition_entertainment.rss",
"http://rss.cnn.com/rss/edition_sport.rss","http://rss.cnn.com/rss/edition_travel.rss"];

// 'loading' gif image
var loading_img = document.createElement('img');
loading_img.id = "loading_gif";
loading_img.src = "loading.gif";
document.getElementById("feedSection").appendChild(loading_img);

// 'no results' png image
var no_results = document.createElement('img');
no_results.id = "nores";
no_results.src = "nores.png";



// getting the geolocation from user
function getGeoLocation() {
  // user granted permission for location
  function success(position) {
    $.ajax({url: `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&APPID=${openWeatherApiKey}`,
      dataType: "json",
      method: 'GET',
      success: function(result){
        // create the weather card according to user location
        createWeatherCard(result);
      },
      beforeSend: function(){
        // show loading gif
        $(loading_img).show();
      },
      complete: function(){
        // hide loading gif
        $(loading_img).hide();
      }
    });
  }

  // user declined permission for location
  function error() {
    console.log('Unable to retrieve your location');
  }

  // if location not supported by the browser
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    // all good - locating...
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

/* global search feature : */
// search input element : on input change event (search feature)
$("#search_input , #search-input-small-screen").on("change paste keyup",function(){
  // clear the #feedSection 
  document.getElementById("feedSection").innerHTML = ''
  // add 'no results' png
  document.getElementById("feedSection").appendChild(no_results);
  // hide 'no results'
  $(no_results).hide();

  // if search input value is empty = load content again
  if(!this.value){
    document.getElementById("feedSection").innerHTML = '';
    loadPage();
  }
  else{
    for(var i = 0; i<rssLinks.length; i++){
      globalSearch(rssLinks[i],$(this).val().toLowerCase());
    }
    
  }
});

// rssLink = link to rss feeds (rssLinks Array)
// input = input from the search field (<input...)
function globalSearch(rssLink, input){
  // ajax rss2json api
  $(loading_img).show();
  $.ajax({
    url: 'https://api.rss2json.com/v1/api.json',
    method: 'GET',
    dataType: 'json',
    data: {
        rss_url: rssLink,
        api_key: rss2JsonApiKey,
        count: 100
    },
    success: function (response) {
    if(response.status != 'ok'){
      throw response.message;
    }
    for(var i = 0; i<response.items.length; i++){
      // description of the feed , removing all unneccecery html tags, all to lower case for easier search
      var desc = response.items[i].description.replace(/<+\S+ [\S ]+/i,'').toLowerCase();
      // feed title , all to lower case for easier search
      var title = response.items[i].title.toLowerCase();
      // check desc and title if contains input
      if(desc.includes(input) || title.includes(input)){
        // create feed card
        createFeedCard(response.items[i], input);
      }
    }
  },
  beforeSend: function() {
    $(loading_img).show();
  },
  complete : function () {
    $(loading_img).hide();
    $('#feedSection').hide().fadeIn('100');
    // if no results  = show the no result image
    if ($("#feedSection .card").length == 0)
      $(no_results).show();
    else{
      $(no_results).hide();
    }
  },
})
}

/* method creating the weather card */
function createWeatherCard(weatherObj){

  var weatherCard = document.createElement("div");
  weatherCard.className = "card";
  weatherCard.style.width = "400px";
  weatherCard.style.padding = "20px";
  weatherCard.style.color = "#727272";
  weatherCard.style.alignSelf = "flex-start";

  var weatherDivCardBody = document.createElement("div");
  weatherDivCardBody.className = "card-body";

  var cityName = document.createElement("h3");
  cityName.innerHTML = weatherObj.name;
  cityName.className = "card-title"

  var weatherIcon = document.createElement("img");
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherObj.weather[0].icon}.png`;
  weatherIcon.style.width = "100px";
  weatherIcon.style.cssFloat = "right";
  weatherIcon.style.marginTop = "-90px"


  var temp = document.createElement("h4");
  // converting from Kelvin to Celcius
  temp.innerText = parseInt(weatherObj.main.temp-273.15)+"C";
  temp.style.fontSize = "70px";
  temp.cssFloat = "left";
  temp.style.color = "#4c4c4c";



  var press = document.createElement("p");
  press.innerText = weatherObj.main.pressure;



  var hum = document.createElement("p");
  hum.innerText = weatherObj.main.humidity+"%";

  var windSpeedIcon = document.createElement("img");
  windSpeedIcon.src = "https://banner2.kisspng.com/20180424/qsq/kisspng-computer-icons-humidity-weather-wind-speed-famous-family-wind-5aded662520844.202234551524553314336.jpg";
  windSpeedIcon.style.width = "60px";
  


  weatherDivCardBody.appendChild(cityName);
  weatherDivCardBody.appendChild(temp);
  weatherDivCardBody.appendChild(weatherIcon);
  weatherDivCardBody.appendChild(windSpeedIcon);
  weatherDivCardBody.appendChild(hum);
  weatherCard.appendChild(weatherDivCardBody);
  document.getElementById("feedSection").appendChild(weatherCard);

}


/* fetching rss feeds using the rss2json api */
function fetchFeeds(rssLink){
  // unique api key
  var sortedItems;
  $(loading_img).show();
  
  // using jQuerry ajax
  // this call is an api specific
  $.ajax({
    url: 'https://api.rss2json.com/v1/api.json',
    method: 'GET',
    dataType: 'json',
    data: {
        rss_url: rssLink,
        api_key: rss2JsonApiKey,
        count: 100
    },
    success: function (response) {
      if(response.status != 'ok'){
        throw response.message;
      }
  
      // sorting feeds by pubDate (publication date)
      sortedItems = response.items.sort(function(a, b) {
        var dateA = new Date(a.pubDate), dateB = new Date(b.pubDate);
        return dateB - dateA;
      });    
      for(var i = 0; i<sortedItems.length; i++){
        var item = sortedItems[i];
        createFeedCard(sortedItems[i], null);
      }
      
    },
    
    complete : function () {
      $(loading_img).hide();
      $('#feedSection').hide().fadeIn('100');
    }
  
});
}



// creating feed cards and place in feed section
function createFeedCard(feedObj, search_str){

  // using regex to remove any '<img...' or any other HTML tags from feed description
  var patt = /<+\S+ [\S ]+/i;

  var divFeed = document.createElement("div");
  divFeed.className = "card"
  divFeed.style.width = "250px";
  divFeed.style.margin = "10px";
  divFeed.style.alignSelf = "flex-start";

  var img = document.createElement("img");
  img.className = "card-img-top";
  if(feedObj.enclosure.link == null){
    img.src = "https://www.logodesignlove.com/images/negative/nbc-logo-design.jpg";
  }
  else{
    img.src = feedObj.enclosure.link;
  }
  img.alt = "Card image";
  img.style.width = "100%";

  var divCardBody = document.createElement("div");
  divCardBody.className = "card-body";

  var title = document.createElement("h4");
  title.className = "card-title";

  var desc = document.createElement("p");
  desc.className = "card-text";

  // description text from feed object
  var descText = feedObj.description.replace(patt,'');//replacing any html tags with ''
  desc.innerHTML = descText;
  title.innerHTML = feedObj.title;
  if(search_str != null){
    
    
    // using regex pattern to find the search string (upper or lower case)
    // regex example :
    // if search word is trump (or Trump)->regex pattern:  /([trumpTRUMP]{5})/g
    var ptrn = `([${search_str.toLowerCase()}${search_str.toUpperCase()}]{${search_str.length}})`;
    console.log(ptrn);
    
    var re = new RegExp(ptrn,"g");

    // $1 replace with first match
    title.innerHTML = feedObj.title.replace(re, '<span>$1</span>');
    desc.innerHTML = descText.replace(re, '<span>$1</span>');
  }

  // no more then 100 chars in description (and add '...')
  if(descText.length > 100)
    desc.innerHTML = descText.substring(0, 100)+"...";
  

  var timeStamp = document.createElement("h4");
  timeStamp.style.fontSize = "10px";
  timeStamp.style.fontStyle = "italic";
  timeStamp.style.color = "#A9A9A9";
  timeStamp.innerText = feedObj.pubDate;
  timeStamp.style.position = "absolute";
  timeStamp.style.bottom = "0";
  timeStamp.style.right = "0";
  timeStamp.style.marginRight = "9px";
  timeStamp.style.cssFloat = "right";

  var feedLink = document.createElement("a");
  feedLink.className = "stretched-link";
  feedLink.href = feedObj.link;
  feedLink.innerText = "read full article";

  divCardBody.appendChild(title);
  divCardBody.appendChild(desc);
  divCardBody.appendChild(feedLink);
  divCardBody.appendChild(timeStamp);

  divFeed.appendChild(img);
  divFeed.appendChild(divCardBody);
  document.getElementById("feedSection").appendChild(divFeed);
}

function loadPage(){
  switch(sPage){
    case "":
        fetchFeeds("http://rss.cnn.com/rss/edition.rss");
        break;
    case "world":
        fetchFeeds("http://rss.cnn.com/rss/edition_world.rss");
        break;
    case "tech":
        fetchFeeds("http://rss.cnn.com/rss/edition_technology.rss");
        break;
    case "middle-east":
        fetchFeeds("http://rss.cnn.com/rss/edition_meast.rss");
        break;
    case "science-and-space":
        fetchFeeds("http://rss.cnn.com/rss/edition_space.rss");
        break;
    case "entertainment":
        fetchFeeds("http://rss.cnn.com/rss/edition_entertainment.rss");
        break;
    case "world-sport":
        fetchFeeds("http://rss.cnn.com/rss/edition_sport.rss");
        break;
    case "travel":
        fetchFeeds("http://rss.cnn.com/rss/edition_travel.rss");
        break;
    case "weather":
        
        getGeoLocation();
        break;
  }
}

loadPage();


