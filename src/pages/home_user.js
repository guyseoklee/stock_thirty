import React, { useState } from 'react';
import './../App.css';
import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Join from "./Sign_Up.js"
import Login from "./login.js"
import { useNavigate } from "react-router-dom";
import Loding from './Loding';
import SearchIcon from "@material-ui/icons/Search";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
function Home_user() {
  const mapContainer = useRef(null);
  useEffect(() => {
    const { naver } = window;

    const location = new naver.maps.LatLng(37.282962234404806, 127.04758924770678);
    const options = {
      center: location,
      zoom: 18,
    };
    const map = new naver.maps.Map(mapContainer.current, options);

    const markerPosition = new naver.maps.LatLng(37.282962234404806, 127.04758924770678);
    var marker = new naver.maps.Marker({
      position: markerPosition,
      map,
    });
    var contentString = [
      '<div class="iw_inner">sdfsfdsfsfd</div>'
    ].join('');
    var infowindow = new naver.maps.InfoWindow({
      content: contentString
    });

    naver.maps.Event.addListener(marker, "click", function (e) {
      if (infowindow.getMap()) {
        infowindow.close();
      } else {
        infowindow.open(map, marker);
      }
    });
  })
  let [temp, setTemp] = useState(true);
  const filter_hidden = 'filter_hidden';
  const filter_btn_hidden = "filter_btn_hidden";
  let navigate = useNavigate();
  function switchTemp() {
    setTemp(!temp);
  }

  return (
    <div className="App">
      <div className='wrap' style={{ display: "none" }}>
        <header id='header'>
          <div className='logo'>재고30</div>
          <nav className='nav'>검색 | 로그인 | 회원가입 | 마이페이지</nav>
        </header>
        <main id="contents" ref={mapContainer} >

        </main>
        <footer id="footer">
          <div className='footer1'>재고30</div>
          <div className='footer2'>개인정보 및 보호정책 등</div>
        </footer>
      </div>
      <Routes>
        <Route path="/" element={
          <div>
            <div className="App">
              <div className='wrap' >
                <header id='header'>
                  <div className='logo'>재고30</div>
                  <nav className='nav'>
                    <ul>
                      <li>
                        <a href="">
                          <SearchIcon fontSize="large" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <StarBorderIcon fontSize="large" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <ExitToAppIcon fontSize="large" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <AccountCircleIcon fontSize="large"/> <span>나윤호님</span>
                        </a>
                        
                      </li>
                    </ul></nav>
                </header>
                <main id="contents" ref={mapContainer} style={{ width: "100%", height: "85%" }}>

                </main>
                <footer id="footer">
                  <div className='footer1'>재고30</div>
                  <div className='footer2'>개인정보 및 보호정책 등</div>
                </footer>
              </div>
              <div id='filter' className={`${temp ? "" : filter_hidden}`}>
                <div className={`filter ${temp ? "" : filter_hidden}`}>
                  필터링
                </div>
                <div className="filter-btn">
                  <button className="filter1-btn" onClick={(e) => {
                    setTemp(switchTemp);
                  }}>
                    {temp ? '◀️' : '▶️'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        } />
        <Route path='/sign_up' element={
          <div><Join />
          </div>
        } />
        <Route path='/login' element={
          <div><Login />
          </div>
        }/>
        <Route path="/login/oauth2/loading" element={<div>
          <Loding/>
        </div>}/>
        <Route path='*' element={<div>없는 페이지</div>} />

      </Routes>
    </div>
  );
}

export default Home_user;