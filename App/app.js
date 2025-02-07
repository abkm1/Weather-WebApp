const inputCity=document.getElementById('input_city');
const searchBtn=document.getElementById('searchBtn');
const locationBtn=document.getElementById('locationBtn');
api_key='34cd32311c59c94e5a9aeab9358f2b38';
currentWeatherCard=document.querySelectorAll('.weather-left .card')[0];
fiveDaysForecastCard=document.querySelector('.day-forecast');

function getweatherDetails(name,lat,lon,country,state){
   let FORECAST_API_URL= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
   WEATHER_API_URL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
   days=[
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
   ],
   months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  

  fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
         let date=new Date();
         currentWeatherCard.innerHTML=`
           <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-regular fa-calendar"></i> ${days[date.getDay()]},${date.getDay()+2}, ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                    <p> <i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
                </div>
         `;
  }).catch(()=>{
    alert('Failed to fetch current weather')
  });

  fetch(FORECAST_API_URL).then(res=>res.json()).then(data=>{
   let uniqueForecastDays=[];
   let fiveDaysForecast=data.list.filter(forecast=>{
      let forecastDate=new Date(forecast.dt_txt).getDate();
      if(!uniqueForecastDays.includes(forecastDate)){
        return uniqueForecastDays.push(forecastDate)
      }
   });
   fiveDaysForecastCard.innerHTML='';
   for (let i = 0; i < fiveDaysForecast.length; i++) {
    let date=new Date(fiveDaysForecast[i].dt_txt)
    fiveDaysForecastCard.innerHTML+=`
    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
     </div>
    `;
   }
  }).catch(()=>{
    alert('Failed to fetch current weather forecast')
  })
} 
function getCityCoordinates(){
    let cityName=inputCity.value
    inputCity.value='';
    if(!inputCity) return;
    let GEOCODING_API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&
    limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res=>res.json()).then(data=>{
       let {name,lat,lon,country,state}=data[0];
       getweatherDetails(name,lat,lon,country,state)
    }).catch(()=>{
        alert(`Failed to fetch coordinates of ${cityName}`);
    })
}

searchBtn.addEventListener('click',getCityCoordinates)