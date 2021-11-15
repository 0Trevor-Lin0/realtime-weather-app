// ./src/WeatherApp.js
import React, { useState, useEffect, useMemo } from "react";

// 載入 emotion 的 styled 套件
import styled from "@emotion/styled";

import WeatherCard from "./WeatherCard";

// 匯入日出日落資料
import sunriseAndSunsetData from "./sunrise-sunset.json";

// 從 emotion-theming 中載入 ThemeProvider
import { ThemeProvider } from "@emotion/react";

import useWeatherApi from "./useWeatherApi";
import WeatherSetting from "./WeatherSetting";
import { findLocation } from "./utils";

// STEP 1：定義主題配色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

// 定義帶有 styled 的 component
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getMoment = (locationName) => {
  // 從日出日落時間中找出符合的地區
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  // 找不到的話則回傳 null
  if (!location) return null;

  // 取得當前時間
  const now = new Date();

  // 將當前時間以 "2019-10-08" 的時間格式呈現
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");

  // 從該地區中找到對應的日期
  const locationDate =
    location.time && location.time.find((time) => time.dateTime === nowDate);

  // 將日出日落以及當前時間轉成時間戳記（TimeStamp）
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  // 若當前時間介於日出和日落中間，則表示為白天，否則為晚上
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

const WeatherApp = () => {
  console.log("invoke function component");
  // 從 localStorage 取出 cityName，並取名為 storageCity
  const storageCity = localStorage.getItem("cityName");
  // 使用 useState 定義當前要拉取天氣資訊的地區，預設值先定為「臺北市」
  // 若 storageCity 存在則作為 currentCity 的預設值，否則使用 '臺北市'
  const [currentCity, setCurrentCity] = useState(storageCity || "臺北市");

  // 根據 currentCity 來找出對應到不同 API 時顯示的地區名稱，找到的地區取名為 locationInfo
  const currentLocation = findLocation(currentCity) || {};
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  // 使用 useState 並定義 currentTheme 的預設值為 light
  const [currentTheme, setCurrentTheme] = useState("light");
  // 定義 currentPage 這個 state，預設值是 WeatherCard
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [
    currentLocation.sunriseCityName
  ]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  // 當 currentCity 有改變的時候，儲存到 localStorage 中
  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
  }, [currentCity]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* 利用條件渲染的方式決定要呈現哪個組件 */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            // STEP 5：把縣市名稱傳入 WeatherCard 中用以顯示
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            // 把縣市名稱傳入 WeatherSetting 中當作表單「地區」欄位的預設
            cityName={currentLocation.cityName}
            // 把 setCurrentCity 傳入，讓 WeatherSetting 可以修改 currentCity
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
