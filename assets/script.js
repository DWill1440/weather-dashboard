$(document).ready(function() {
  const listOfCities = [];
  // define initiateSearch function
  
  $("#test-button").on("click", () => {
      if ($("#search-bar").val() === "") {
          alert("Enter City");
          return
  }
      var inputCity = $("#search-bar").val();
      var cities = (localStorage.getItem("listOfCities"))
      if (!cities) {
          cities = []
      }
      else {
          cities = cities.split(",")
          }
      
      if(cities.indexOf(inputCity) < 0) {
        cities.push(inputCity);
      }
            localStorage.setItem("listOfCities", cities)
      currentWeatherData(inputCity);
      weekWeather(inputCity);
      $("#search-bar").val("");
      renderButtons();
  });
  function renderButtons() {
      var _cities = (localStorage.getItem("listOfCities"));
      $("#previous-search").html('');
      if (_cities) {
          _cities = _cities.split(",")
          _cities.forEach(function (city) {
            console.log(city);
            var newRow = $("<button>");
            newRow.addClass("new-added-row cityButton").text(city);
              
            newRow.click(function(event){
              currentWeatherData($(event.target).text());
              weekWeather($(event.target).text())
            });
            $("#previous-search").append(newRow);
          });
      }
  }
  function currentWeatherData(inputCity) {
      fetch(
       "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=402675f96bde8ad047ff5b58066a0e0a&units=imperial"
      )
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
              //Fetch UV Index info
              var coordLat = data.coord.lat;
              var coordLon = data.coord.lon;
          fetch(
              `http://api.openweathermap.org/data/2.5/uvi?appid=402675f96bde8ad047ff5b58066a0e0a&lat=${coordLat}&lon=${coordLon}`
          )
          .then(function (response) {
              return response.json();
          })
              .then(function (uvIndex) {
                  var todaysForecast = $("#today-forecast");
                  todaysForecast.empty();
                  const uv= uvIndex.value;
                  let uvColorClass = '';
                  if (uv < 12) {
                    uvColorClass =' green';
                  } else if ( uv <16 ){
                    uvColorClass = 'yellow';
                  }
                  //var for today
                  var titleEl = $("<h2>");
                  var temperatureEl = $("<h4>");
                  var humidityEl = $("<h4>");
                  var windSpeedEl = $("<h4>");
                  var uvIndexEl = $("<h4>");
                  //creating elements
                  titleEl.text(data.name);
                  temperatureEl.text("Temperature: " + data.main.temp + " °F");
                  humidityEl.text("Humidity: " + data.main.humidity + " %");
                  windSpeedEl.text("Wind Speed: " + data.wind.speed + " MPH");
                  uvIndexEl.addClass(uvColorClass).text("UV Index: " + uvIndex.value)
                  //appending elements
                  todaysForecast.append(titleEl);
                  todaysForecast.append(temperatureEl);
                  todaysForecast.append(humidityEl);
                  todaysForecast.append(windSpeedEl);
                  todaysForecast.append(uvIndexEl);
              })
      });
  }
  function weekWeather(inputCity) {
      fetch (
          "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity +
          "&appid=402675f96bde8ad047ff5b58066a0e0a&units=imperial"
      )
      .then (function(response) {
          return response.json()
      })
      .then (function(data) {
          var fiveDayForecast = $("#five-day-forecast");
          fiveDayForecast.empty();
          var seen = {}
          var results = []
          for (i = 0; i < data.list.length; i++) {
              var current = data.list[i]
              var currentDate = current.dt_txt.split(" ")[0]
              if (seen [currentDate] === undefined) {
                  results.push(current)
                  seen[currentDate] = true
              }
              if (results.length === 5){
                  break
              }
          }
          for (i = 0; i < results.length; i++) {
              var temp = results[i].main.temp
              var humidity = results[i].main.humidity
              var currentDate = results[i].dt_txt.split(" ")[0]
              var image = 'http://openweathermap.org/img/wn/' + results[i].weather[0].icon + '@2x.png'
              var html = `
              <div class="card" style="width: 18rem;">
              <div class="card-body">
              <h5 class="card-title"> ${currentDate}</h5>
              <img src= "${image}" class="card-img-top" alt="weather icon">
              <h5 class=="card-text"> Temperature ${temp} </h5>
              <h5 class=="card-text"> Humidity ${humidity}</h5>
              </div>
              </div>
              `
              fiveDayForecast.append(html);
          }
      })
  }
});


