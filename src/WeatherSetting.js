import React, { useState } from "react";
import styled from "@emotion/styled";
import { availableLocations } from "./utils";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

// 從 availableLocations 取出 cityName 來做為讓使用者可以選擇地區的清單
const locations = availableLocations.map((location) => location.cityName);

const WeatherSetting = ({ setCurrentPage, cityName, setCurrentCity }) => {
  // 定義 locationName，預設值先帶為空
  const [locationName, setLocationName] = useState(cityName);

  // 定義 handleChange 要做的事
  const handleChange = (e) => {
    console.log(e.target.value);
    // 把使用者輸入的內容更新到 React 內的資料狀態
    setLocationName(e.target.value);
  };

  // 定義 handleSave 方法
  const handleSave = () => {
    // 判斷使用者填寫的地區是否包含在 locations 陣列內
    if (locations.includes(locationName)) {
      // TODO: 儲存地區資訊...
      console.log(`儲存地區資訊為${locationName}`);
      // 下儲存時更新 WeatherApp 內的 currentCity
      setCurrentCity(locationName);
      // 透過 setCurrentPage 導回天氣資訊頁
      setCurrentPage("WeatherCard");
    } else {
      // 若不包含在 locations 內，則顯示錯誤提示
      console.log(`儲存失敗:您輸入的${locationName}非有效地區`);
    }
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      {/* STEP 3：使用 onChange 事件來監聽使用者輸入資料 */}
      {/* STEP 2：透過 value 帶入該欄位的預設值 */}
      {/* 將 useRef 回傳的物件，指稱為該 input 元素 */}
      {/* 在 uncontrolled components 中可以使用 defaultValue 定義預設值 */}
      <StyledInputList
        value={locationName}
        list="location-list"
        id="location"
        name="location"
        onChange={handleChange}
      />
      <datalist id="location-list">
        {/* 定義 datalist 中的 options*/}
        {locations.map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>

      <ButtonGroup>
        <Back onClick={() => setCurrentPage("WeatherCard")}>返回</Back>
        {/* STEP 5：將 handleSave 綁定在 onClick 事件 */}
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
