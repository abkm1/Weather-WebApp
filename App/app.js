const inputCity=document.getElementById('input_city');
const searchBtn=document.getElementById('searchBtn');
const locationBtn=document.getElementById('locationBtn');
const currentWeatherCard=document.querySelectorAll('.weather-left .card')[0];
const fiveDaysForecastCard=document.querySelector('.day-forecast');
const apiCard=document.querySelectorAll('.highlights .card')[0];
const sunriseCard=document.querySelectorAll('.highlights .card')[1];
const aqiList=[
  'Good',
  'Fair',
  'Moderate',
  'Poor',
  'Very Poor'];

const humidityVal=document.getElementById('humidityVal');
const pressureVal=document.getElementById('pressureVal');
const visibilityVal=document.getElementById('visibilityVal');
const windSpeedVal=document.getElementById('windSpeedVal');
const hourlyForecastCard = document.querySelector('.hourly-forecast')
const feelsVal=document.getElementById('feelsVal');
const api_key='34cd32311c59c94e5a9aeab9358f2b38';

//events
inputCity.addEventListener('keyup',e=>e.key==='Enter' && getCityCoordinates());
searchBtn.addEventListener('click',getCityCoordinates);
locationBtn.addEventListener('click',getUserCoordinates);
window.addEventListener('load',getUserCoordinates);


function getweatherDetails(name,lat,lon,country,state){
   let FORECAST_API_URL= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
   WEATHER_API_URL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
   AIR_POLUTION_API_URL= `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,

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
    "January", "February", 
    "March","April",
     "May", "June", 
     "July", "August", 
     "September", "October", 
     "November", "December"
  ];
  
  fetch(AIR_POLUTION_API_URL).then(res=>res.json()).then(data=>{
    let{co,no,no2,o3,so2,pm2_5,pm10,nh3}=data.list[0].components;
    apiCard.innerHTML=`
                    <div class="card-head">
                        <p>Air Quality index</p>
                        <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi-1]}</p>
                    </div>
                    <div class="air-indices">
                        <i class="fa-solid fa-wind"></i>
                        <div class="item">
                            <p>PM2.5</p>
                            <h2>${pm2_5}</h2>
                        </div>
                        
                        <div class="item">
                            <p>PM10</p>
                            <h2>${pm10}</h2>
                        </div>
                        <div class="item">
                            <p>SO2</p>
                            <h2>${so2}</h2>
                        </div>
                        <div class="item">
                            <p>CO</p>
                            <h2>${co}</h2>
                        </div>
                        <div class="item">
                            <p>NO</p>
                            <h2>${no}</h2>
                        </div>
                        <div class="item">
                            <p>NO2</p>
                            <h2>${no2}</h2>
                        </div>
                        <div class="item">
                            <p>NH3</p>
                            <h2>${nh3}</h2>
                        </div>
                        <div class="item">
                            <p>O3</p>
                            <h2>${o3}</h2>
                        </div>
                    </div>
    `
  }).catch(()=>{
    alert('Failed to fetch air quality index');
  });

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

         let {sunrise,sunset}=data.sys;
         let {timezone , visibility}=data;
         let {humidity,pressure, feels_like}=data.main;
         let {speed}=data.wind;
         sunRiseTime=moment.utc(sunrise,'X').add(timezone,'seconds').format('hh:mm A')
         sunSetTime=moment.utc(sunset,'X').add(timezone,'seconds').format('hh:mm A');
         sunriseCard.innerHTML=`
                    <div class="card-head">
                        <p>Sunrise & Sunset</p>
                    </div>
                    <div class="sunrise-sunset">
                        <div class="item">
                            <div class="icon">
                                <i class="fa-solid fa-sun"></i>
                            </div>
                            <div>
                                <p>sunrise</p>
                                <h2>${sunRiseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon">
                                <i class="fa-solid fa-sun"></i>
                            </div>
                            <div>
                                <p>sunset</p>
                                <h2>${sunSetTime}</h2>
                            </div>
                        </div>

                    </div>
         `;


         humidityVal.innerHTML=`${humidity} %`;
         pressureVal.innerHTML=`${pressure} hPa`;
         visibilityVal.innerHTML=`${visibility / 1000} km`;
         windSpeedVal.innerHTML=`${speed} m/s`;
         feelsVal.innerHTML=`${(feels_like - 273.15).toFixed(2)}&deg;C`;

  }).catch(()=>{
    alert('Failed to fetch current weather')
  });


  fetch(FORECAST_API_URL).then(res=>res.json()).then(data=>{
    let hourlyForecast=data.list;
    hourlyForecastCard.innerHTML=`

    `;
    for (let i = 0; i <=7; i++) {
      let hrForeCastDate=new Date(hourlyForecast[i].dt_txt);
      let hr=hrForeCastDate.getHours();
      let a='PM';
      if(hr<12) {
        a='AM';
      }
      if(hr==0){
        hr=12;
      } 
      if(hr>12){
        hr=hr-12;
      }
      hourlyForecastCard.innerHTML+=`
      <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp-273.15).toFixed(2)}&deg;C</p>
                </div>
      `;
      
    }

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


function getUserCoordinates(){
  navigator.geolocation.getCurrentPosition(position=>{
    let {latitude, longitude}=position.coords;
    let REVERSE_GEOCODING_URL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
    
    fetch(REVERSE_GEOCODING_URL).then(res=>res.json()).then(data=>{
      let {name , country , state}=data[0];
      getweatherDetails(name , latitude,longitude,country,state);
      
    }).catch(()=>{
      alert("Faieled to fetch user's info")
    })
  }, error =>{
    if(error.code===error.PERMISSION_DENIED){
      alert('Gealocation permission denied')
    }
  })
}

