
      const userTab = document.querySelector("[data-userwhether]");
      const searchtab = document.querySelector("[data-searchwheather]");
      const usercontainermain = document.querySelector(".whether-container");

      const grantAccesscontainer = document.querySelector(
        ".grant-locationcontainer"
      );
      const searchform = document.querySelector("[data-searchform]");
      const loadingscreen = document.querySelector(".loading-container");
      const userinfocontainer = document.querySelector(".user-info-container");

      let currentTab = userTab;
      const API_key = "d1845658f92b31c64bd94f06f7188c9c";
      currentTab.classList.add("current-tab");
      getfromsessionStorage();

      function switchTab(clickedTab) {
        if (clickedTab != currentTab) {
          currentTab.classList.remove("current-tab");
          currentTab = clickedTab;
          currentTab.classList.add("current-tab");

          if (!searchform.classList.contains("active")) {
            userinfocontainer.classList.remove("active");
            grantAccesscontainer.classList.remove("active");
            searchform.classList.add("active");
          } else {
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromsessionStorage();
          }
        }
      }

      userTab.addEventListener("click", () => {
        switchTab(userTab);
      });
      searchtab.addEventListener("click", () => {
        switchTab(searchtab);
      });

      function getfromsessionStorage() {
        const localCoordinates = sessionStorage.getItem("user-corrdinates");
        if (!localCoordinates) {
          grantAccesscontainer.classList.add("active");
        } else {
          const coordinates = JSON.parse(localCoordinates);
          fetchUserWeatherInfo(coordinates);
        }
      }
      async function fetchUserWeatherInfo(coordinates) {
        const { lat, lon } = coordinates;
        grantAccesscontainer.classList.remove("active");
        loadingscreen.classList.add("active");
        // API call
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`
          );

          let data = await response.json();
          loadingscreen.classList.remove("active");
          userinfocontainer.classList.add("active");
          renderWeatherInfo(data);
        } catch (err) {
          loadingscreen.classList.remove("active");
          userinfocontainer.classList.remove("active");
          console.log("error found", err);
        }
      }

      function renderWeatherInfo(weatherinfo) {
        // firstly fetch the elements
        const cityname = document.querySelector("[data-cityname]");
        const countryIcon = document.querySelector("[data-countryicon]");
        const desc = document.querySelector("[data-weatherdesc]");
        const weathericon = document.querySelector("[data-weathericon]");
        const temp = document.querySelector("[data-temperature]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humadity = document.querySelector("[data-humadity]");
        const cloudness = document.querySelector("[data-cloudness]");

        // fetch value form weather objects and print on the ui

        cityname.innerText = weatherinfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;

        desc.innerText = weatherinfo?.weather?.[0]?.description;
        weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherinfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
        humadity.innerText = `${weatherinfo?.main?.humidity} %`;
        cloudness.innerText = `${weatherinfo?.clouds?.all} %`;
      }

      const grantAccessButton = document.querySelector("[data-grantAccess]");
      grantAccessButton.addEventListener("click", getlocation);

      function getlocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPostion);
        } else {
          alert("browser does not support geo location");
        }
      }

      function showPostion(position) {
        const userCorrdinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        sessionStorage.setItem(
          "user-coordinates",
          JSON.stringify(userCorrdinates)
        );
        fetchUserWeatherInfo(userCorrdinates);
      }

      const searchinput = document.querySelector("[data-searchinput]");

      searchform.addEventListener("submit", (e) => {
        e.preventDefault();
        let cityname = searchinput.value;
        if (cityname === "") return;
        else {
          fetchSearchWeatherInfo(cityname);
        }

        async function fetchSearchWeatherInfo(cityname) {
          loadingscreen.classList.add("active");
          userinfocontainer.classList.remove("active");
          grantAccesscontainer.classList.remove("active");
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_key}&units=metric`
            );
            

            if (!response.ok){
              console.log('error is ready');
              userinfocontainer.classList.remove('active');
              loadingscreen.classList.remove('active');
              alert(`City not found (HTTP ${response.status})`);
            }
            else{
              
            const data = await response.json();
            loadingscreen.classList.remove("active");
            userinfocontainer.classList.add("active");
            renderWeatherInfo(data);}
          } catch(err) {
            
            
            console.log("error found", err);
          }
        }
      });
    