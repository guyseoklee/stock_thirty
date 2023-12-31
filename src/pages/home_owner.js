import React, { useState } from 'react';
import './../App.css';
import { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import axios from "axios";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Avatar from 'react-avatar';
import StoreIcon from '@mui/icons-material/Store';
import { TextField, Button, InputAdornment } from "@mui/material";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RoomIcon from '@mui/icons-material/Room';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import CallIcon from '@mui/icons-material/Call';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Marker4 from "./../img/marker4.gif";
import MessageIcon from '@mui/icons-material/Message';
import StarRateIcon from '@mui/icons-material/StarRate';
import LogoutIcon from '@mui/icons-material/Logout';
function Home_owner() {
    /*마이페이지*/
    const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
    const fileInput = useRef(null)
    /*지도*/
    /*지도에 현 위치 불러오기*/

    let [a, setA] = useState(0);
    let [b, setB] = useState(0);
    const [showFilter, setShowFilter] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const [shopInfo, setShopInfo] = useState([]);
    const [selectedShop, setSelectedShop] = useState([]);
    const mapContainer = useRef(null);
    function getBarColor(trust) {
        if (trust * 40 >= 360) {
            return "#3498db";
        } else if (trust * 40 >= 280) {
            return "#27ae60";
        } else if (trust * 40 >= 160) {
            return "#f39c12";
        } else if (trust * 40 >= 80) {
            return "#f1c40f";
        } else {
            return "#e74c3c";
        }
    }
    function formatDate(dateString) {
        const originalDate = new Date(dateString);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        const formattedDate = originalDate.toLocaleString("ko-KR", options);
        return formattedDate;
    }

    let [search_store_switch, setSearch_store_switch] = useState(true);
    let [search_store_switch2, setSearch_store_switch2] = useState(true);
    let [switch3, setSwitch3] = useState(0);

    let [search_store, setSearch_store] = useState([]);
    /*상세 페이지*/
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [cViewVisible, setCViewVisible] = useState(false);
    const [reViewvisible, setReViewVisible] = useState(false);
    const [menuData, setMenuData] = useState([]);
    useEffect(() => {
        const { naver } = window;
        let showDetailsLink = null;
        let map = null;
        let infowindow = null;

        navigator.geolocation.getCurrentPosition(function (position) {
            const location = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
            const options = {
                center: location,
                zoom: 18,
            };
            map = new naver.maps.Map(mapContainer.current, options);


            function toggleFilterAndDetail() {
                setShowFilter(!showFilter);
                setShowDetail(!showDetail);
            }

            function closeInfoWindow() {
                if (showDetailsLink) {
                    showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                }
                infowindow.close();
            }


            if (switch3 == 2) {
                axios.get('/member/bookmark/check')
                    .then(response => {
                        let search_fv_store = response.data;
                        search_fv_store.forEach(shop => {
                            let markerPosition = new naver.maps.LatLng(shop.latitude, shop.longitude);

                            var marker = new naver.maps.Marker({
                                position: markerPosition,
                                map,
                                icon: {
                                    url: Marker4, //아이콘 경로
                                    size: new naver.maps.Size(48, 48), //아이콘 크기
                                    origin: new naver.maps.Point(0, 0),
                                    anchor: new naver.maps.Point(10, 40)
                                }
                            });
                            let copy = shop
                            setShopInfo(prevShopInfo => [...prevShopInfo, shop]);
                            var contentString = [
                                `<div class="iw_inner" id="showDetails" style="border-radius: 10px;">`,
                                `<div style="width: 50%; height: 90px; "><img src="/shopimages/${shop.imageFilename}" alt=${shop.imageFilename} style="width: 100%; height: 90px; border-radius:20px; border:4px solid transparent;"></img></div>`,
                                `<div><div style="margin-top: 15px; margin-left: 10px;"><a style="font-weight:700">${shop.shopName}</a></div>`,
                                `<div style="margin-top: 15px; margin-top: 10px;"><span className="ct3" style="font-weight:700">${shop.rating}/5</span></div></div>`,
                                `</div>`
                            ].join('');
                            var infowindow = new naver.maps.InfoWindow({
                                content: contentString
                            });
                            function toggleFilterAndDetail() {
                                setShowFilter(!showFilter);
                                setShowDetail(!showDetail);
                            }

                            function addClickListener() {
                                // click 이벤트 리스너를 한 번만 추가
                                naver.maps.Event.addListener(marker, "click", function (e) {
                                    if (infowindow.getMap()) {
                                        infowindow.close();
                                        if (showDetailsLink) {
                                            showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                                        }
                                    } else {
                                        infowindow.open(map, marker);
                                        const clickedShopName = shop.shopName;

                                        console.log(clickedShopName);

                                        // shopInfo 배열에서 같은 이름을 가진 가게를 찾습니다.
                                        const selectedShopInfo = shopInfo.find(info => info.shopName === clickedShopName);

                                        // 만약 해당 정보를 찾았다면 selectedShopInfo에 그 정보가 저장됩니다.
                                        if (selectedShopInfo) {
                                            let formattedPhoneNumber = selectedShopInfo.shopTel.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                                            selectedShopInfo.shopTel = formattedPhoneNumber;
                                            setSelectedShop(selectedShopInfo);
                                        }
                                        const iwInner = document.getElementById('showDetails');
                                        const image = iwInner.querySelector('img');
                                        const a = iwInner.querySelector("a");
                                        const ct3 = iwInner.querySelector("span");
                                        iwInner.addEventListener('mouseover', function () {
                                            image.style.backgroundColor = " #383737";
                                            a.style.color = "white";
                                            ct3.style.color = "white"
                                        });

                                        iwInner.addEventListener('mouseout', function () {
                                            image.style.backgroundColor = 'white';
                                            a.style.color = "black";
                                            ct3.style.color = "black"
                                        });
                                        showDetailsLink = document.getElementById('showDetails');
                                        // showDetailsLink에 대한 click 이벤트 리스너 추가
                                        if (showDetailsLink) {
                                            console.log(showDetailsLink);
                                            showDetailsLink.clickListener = toggleFilterAndDetail;
                                            showDetailsLink.addEventListener('click', showDetailsLink.clickListener);
                                        }
                                    }
                                });
                            }
                            function closeInfoWindow() {
                                if (showDetailsLink) {
                                    showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                                }
                                infowindow.close();
                            }

                            addClickListener();

                            document.querySelector('.detail_store_close').addEventListener('click', closeInfoWindow);

                        });
                    })
                    .catch(error => {

                        console.error('세션 데이터를 가져오는데 실패함', error);
                    });

                setA(1);
            } else if (switch3 == 1) {
                axios.get('/getShop/filter', {
                    params: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        distance: rangeValue,
                        unit: "km",
                        minprice: minPrice,
                        maxprice: maxPrice,
                        time: endTime,
                        rating: maxStars,
                    }
                }).then(response => {//데이터를받아오는게성공시 다른페이지호출
                    let search_store = response.data;
                    console.log(response.data);
                    search_store.forEach(shop => {
                        let markerPosition = new naver.maps.LatLng(shop.latitude, shop.longitude);
                        var marker = new naver.maps.Marker({
                            position: markerPosition,
                            map,
                            icon: {
                                url: Marker4, //아이콘 경로
                                size: new naver.maps.Size(48, 48), //아이콘 크기
                                origin: new naver.maps.Point(0, 0),
                                anchor: new naver.maps.Point(10, 40)
                            }
                        });
                        let copy = shop
                        setShopInfo(prevShopInfo => [...prevShopInfo, shop]);
                        var contentString = [
                            `<div class="iw_inner" id="showDetails" style="border-radius: 10px;">`,
                            `<div style="width: 50%; height: 90px; "><img src="/shopimages/${shop.imageFilename}" alt=${shop.imageFilename} style="width: 100%; height: 90px; border-radius:20px; border:4px solid transparent;"></img></div>`,
                            `<div><div style="margin-top: 15px; margin-left: 10px;"><a style="font-weight:700">${shop.shopName}</a></div>`,
                            `<div style="margin-top: 15px; margin-top: 10px;"><span className="ct3" style="font-weight:700">${shop.rating}/5</span></div></div>`,
                            `</div>`
                        ].join('');
                        var infowindow = new naver.maps.InfoWindow({
                            content: contentString
                        });
                        function toggleFilterAndDetail() {
                            setShowFilter(!showFilter);
                            setShowDetail(!showDetail);
                        }

                        function addClickListener() {
                            // click 이벤트 리스너를 한 번만 추가
                            naver.maps.Event.addListener(marker, "click", function (e) {
                                if (infowindow.getMap()) {
                                    infowindow.close();
                                    if (showDetailsLink) {
                                        showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                                    }
                                } else {
                                    infowindow.open(map, marker);
                                    const clickedShopName = shop.shopName;

                                    // shopInfo 배열에서 같은 이름을 가진 가게를 찾습니다.
                                    const selectedShopInfo = shopInfo.find(info => info.shopName === clickedShopName);

                                    // 만약 해당 정보를 찾았다면 selectedShopInfo에 그 정보가 저장됩니다.
                                    if (selectedShopInfo) {
                                        let formattedPhoneNumber = selectedShopInfo.shopTel.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                                        selectedShopInfo.shopTel = formattedPhoneNumber;
                                        setSelectedShop(selectedShopInfo);
                                    }
                                    const iwInner = document.getElementById('showDetails');
                                    const image = iwInner.querySelector('img');
                                    const a = iwInner.querySelector("a");
                                    const ct3 = iwInner.querySelector("span");
                                    iwInner.addEventListener('mouseover', function () {
                                        image.style.backgroundColor = " #383737";
                                        a.style.color = "white";
                                        ct3.style.color = "white"
                                    });

                                    iwInner.addEventListener('mouseout', function () {
                                        image.style.backgroundColor = 'white';
                                        a.style.color = "black";
                                        ct3.style.color = "black"
                                    });
                                    showDetailsLink = document.getElementById('showDetails');
                                    // showDetailsLink에 대한 click 이벤트 리스너 추가
                                    if (showDetailsLink) {
                                        console.log(showDetailsLink);
                                        showDetailsLink.clickListener = toggleFilterAndDetail;
                                        showDetailsLink.addEventListener('click', showDetailsLink.clickListener);
                                    }
                                }
                            });
                        }
                        function closeInfoWindow() {
                            if (showDetailsLink) {
                                showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                            }
                            infowindow.close();
                        }

                        addClickListener();

                        document.querySelector('.detail_store_close').addEventListener('click', closeInfoWindow);

                    });
                }).catch(error => {//데이터를받아오는게 실패시 오류 메세지출력하고 다시 login페이지 호출
                    window.alert(error.response.data.result);
                })
            } else if (switch3 == 0) {
                // 예시 마커에 대한 클릭 리스너 추가
                axios.get('/ShopMarker')
                    .then(response => {
                        const shopInfo1 = response.data;
                        shopInfo1.forEach(shop => {
                            let markerPosition = new naver.maps.LatLng(shop.latitude, shop.longitude);
                            var marker = new naver.maps.Marker({
                                position: markerPosition,
                                map,
                                icon: {
                                    url: Marker4, //아이콘 경로
                                    size: new naver.maps.Size(48, 48), //아이콘 크기
                                    origin: new naver.maps.Point(0, 0),
                                    anchor: new naver.maps.Point(10, 40)
                                }
                            });
                            let copy = shop
                            setShopInfo(prevShopInfo => [...prevShopInfo, shop]);
                            var contentString = [
                                `<div class="iw_inner" id="showDetails" style="border-radius: 10px;">`,
                                `<div style="width: 50%; height: 90px; "><img src="/shopimages/${shop.imageFilename}" alt=${shop.imageFilename} style="width: 100%; height: 90px; border-radius:20px; border:4px solid transparent;"></img></div>`,
                                `<div><div style="margin-top: 15px; margin-left: 10px;"><a style="font-weight:700">${shop.shopName}</a></div>`,
                                `<div style="margin-top: 15px; margin-top: 10px;"><span className="ct3" style="font-weight:700">${shop.rating}/5</span></div></div>`,
                                `</div>`
                            ].join('');
                            var infowindow = new naver.maps.InfoWindow({
                                content: contentString
                            });
                            function toggleFilterAndDetail() {
                                setShowFilter(!showFilter);
                                setShowDetail(!showDetail);
                            }

                            function addClickListener() {
                                // click 이벤트 리스너를 한 번만 추가
                                naver.maps.Event.addListener(marker, "click", function (e) {
                                    if (infowindow.getMap()) {
                                        infowindow.close();
                                        if (showDetailsLink) {
                                            showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                                        }
                                    } else {
                                        infowindow.open(map, marker);
                                        const clickedShopName = shop.shopName;

                                        console.log(clickedShopName);
                                        console.log(shopInfo1);

                                        // shopInfo 배열에서 같은 이름을 가진 가게를 찾습니다.
                                        const selectedShopInfo = shopInfo1.find(info => info.shopName === clickedShopName);

                                        console.log(selectedShopInfo);

                                        // 만약 해당 정보를 찾았다면 selectedShopInfo에 그 정보가 저장됩니다.
                                        if (selectedShopInfo) {
                                            let formattedPhoneNumber = selectedShopInfo.shopTel.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                                            selectedShopInfo.shopTel = formattedPhoneNumber;
                                            setSelectedShop(selectedShopInfo);
                                        }
                                        const iwInner = document.getElementById('showDetails');
                                        const image = iwInner.querySelector('img');
                                        const a = iwInner.querySelector("a");
                                        const ct3 = iwInner.querySelector("span");
                                        iwInner.addEventListener('mouseover', function () {
                                            image.style.backgroundColor = " #383737";
                                            a.style.color = "white";
                                            ct3.style.color = "white"
                                        });

                                        iwInner.addEventListener('mouseout', function () {
                                            image.style.backgroundColor = 'white';
                                            a.style.color = "black";
                                            ct3.style.color = "black"
                                        });
                                        showDetailsLink = document.getElementById('showDetails');
                                        // showDetailsLink에 대한 click 이벤트 리스너 추가
                                        if (showDetailsLink) {
                                            console.log(showDetailsLink);
                                            showDetailsLink.clickListener = toggleFilterAndDetail;
                                            showDetailsLink.addEventListener('click', showDetailsLink.clickListener);
                                        }
                                    }
                                });
                            }
                            function closeInfoWindow() {
                                if (showDetailsLink) {
                                    showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                                }
                                infowindow.close();
                            }

                            addClickListener();

                            document.querySelector('.detail_store_close').addEventListener('click', closeInfoWindow);

                        });
                    })
                    .catch(error => {
                        console.error('세션 데이터를 가져오는데 실패함', error);
                    });
            }
            return () => {
                if (showDetailsLink) {
                    showDetailsLink.removeEventListener('click', toggleFilterAndDetail);
                }
                closeInfoWindow();
            };
        });
    }, [search_store_switch]);
    useEffect(() => {
        if (selectedShop) {
            axios.post('/item/getItems', selectedShop)
                .then(response => {
                    console.log(11);
                    console.log(response.data);
                    const menuitem = response.data;
                    setMenuData(menuitem);
                })
                .catch(error => {
                    console.error('메뉴 데이터를 가져오는데 실패함', error);
                });
        } else {
            // 선택된 가게가 없을 경우 메뉴 데이터를 초기화
            setMenuData([]);
        }
    }, [selectedShop]);
    /*필터 버튼(마이페이지) 누를떄 애니메션효과*/
    let [temp, setTemp] = useState(true);
    const filter_hidden = 'filter_hidden';
    const filter_btn_hidden = "filter_btn_hidden";
    let navigate = useNavigate();
    function switchTemp() {
        setTemp(!temp);
    }
    let [temp1, setTemp1] = useState(true);
    let [recall, setRecall] = useState(false);
    let [recall2, setRecall2] = useState(false);
    /*스프링세션에서 리액트로 세션 가져오기*/
    const [userInfo, setUserInfo] = useState("");
    useEffect(() => {
        // 스프링에서 세션 데이터를 가져오는 호출
        axios.get('/getSessionMember/business')
            .then(response => {
                const userData = response.data;
                console.log(userData.redirect)
                if (userData.redirect) {
                    console.log("페이지 이동");
                    window.location.href = userData.redirect;
                } else {
                    setUserInfo(userData);
                    //로그인한 사용자가 상업자라면 공지사항 알림 가져오기

                    axios.get('/manager/notice/getalarm')
                        .then(response => {
                            const alarmData = response.data;
                            setNoticeAlarmInfo(alarmData);
                            alarmData.map((alarm, index) => (
                                console.log(alarm)
                            ));
                        })
                        .catch(error => {
                            console.error('세션 데이터를 가져오는데 실패함', error);
                        });

                }
            })
            .catch(error => {
                console.error('세션 데이터를 가져오는데 실패함', error);
            });
    }, [recall]);

    /*알림 가져오기*/
    const [noticeAlarmInfo, setNoticeAlarmInfo] = useState([]);
    const [alarmInfo, setAlarmInfo] = useState([]);
    const combinedAlarms = [...alarmInfo, ...noticeAlarmInfo].sort(
        (a, b) => a.before - b.before
    );
    useEffect(() => {
        axios.get('/member/getAlarm')
            .then(response => {
                const alarmData = response.data;
                setAlarmInfo(alarmData);
                alarmData.map((alarm, index) => (
                    console.log(alarm)
                ));
            })
            .catch(error => {
                console.error('세션 데이터를 가져오는데 실패함', error);
            });
    }, [recall2]);

    /*닉네임 수정*/
    let [nicname, setNicname] = useState("");
    let [temp2, setTemp2] = useState(true);
    /*즐겨찾기*/

    let [temp3, setTemp3] = useState(true);
    let [shopsData, setShopsData] = useState([]);
    let [fv_store, setFv_store] = useState([]);
    useEffect(() => {
        console.log(shopsData); // 상태가 변경될 때마다 호출됨
    }, [shopsData]);
    /*즐겨찾기 수정*/
    let [temp5, setTemp5] = useState(true);
    let [selectedStores, setSelectedStores] = useState([]);

    /*알림창*/
    let [temp4, setTemp4] = useState(true);

    /*상세페이지 꾸미기*/
    let [search_switch1, setSearch_switch1] = useState(true);
    let [search_switch2, setSearch_switch2] = useState(false);
    let [tapmenu, setTapmenu] = useState(true);
    /*예약확인*/
    let [temp6, setTemp6] = useState(true);
    let [regervation, setRegervation] = useState([]);
    let [selectedregervationStores, setSelectedregervationStores] = useState([]);
    let [search_switch3, setSearch_switch3] = useState(true);
    let [search_switch4, setSearch_switch4] = useState(false);
    let [tapmenu1, setTapmenu1] = useState(true);
    let [confirmstate, setConfirmstate] = useState('wait');

    /*필터 꾸미기*/
    const [rangeValue, setRangeValue] = useState(0); // 초기 슬라이더 값

    const handleRangeChange = (event) => {
        setRangeValue(event.target.value);
    }
    /*필터 가격 선택*/
    const [minPrice, setMinPrice] = useState("0");
    const [minPrice1, setMinPrice1] = useState(0);
    const [maxPrice, setMaxPrice] = useState("");
    const [maxPrice1, setMaxPrice1] = useState(0);
    function addCommasToNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const handleMaxPriceChange = (event) => {
        const inputValue = event.target.value;

        // 입력된 값이 0부터 100,000 사이일 때만 최대 가격을 업데이트
        if (/^\d+$/.test(inputValue) && parseInt(inputValue, 10) >= 0 && parseInt(inputValue, 10) <= 59999) {
            setMaxPrice(inputValue); // 문자열로 설정
            setMaxPrice1(addCommasToNumber(inputValue)); // 문자열로 설정
        }
    }
    useEffect(() => {
        console.log(maxPrice)
    }, [maxPrice])
    const checkOnlyOne1 = (checkThis) => {
        const checkboxes = document.getElementsByName('price')
        let selectedPrice = "0";
        let selectedPrice1 = 0;
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false;
                setMaxPrice(checkThis.value);
                setMaxPrice1(checkThis.value);
            }
        }

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedPrice = checkbox.value;
                selectedPrice1 = parseInt(selectedPrice, 10);
            }
        });

        setMaxPrice(selectedPrice);
        setMaxPrice1(addCommasToNumber(selectedPrice1));
    }
    /*필터 마감 선택*/
    const [endTime, setEndTime] = useState(0); // 초기값 설정 (예: 24시간 마감시간)

    const handleEndTimeChange = (event) => {
        const selectedTime = parseInt(event.target.value, 10);
        setEndTime(selectedTime);
    }


    const checkOnlyOne2 = (checkThis) => {
        const checkboxes = document.getElementsByName('endTime')
        let selectedTime = 0;
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false;
                setEndTime(checkThis.value);
            }
        }
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedTime = parseInt(checkbox.value, 10);
            }
        });

        setEndTime(selectedTime);
    }
    //필터 별점 선택 
    let [maxStars, setMaxStars] = useState(0); // 최대 별점

    const checkOnlyOne = (checkThis) => {
        const checkboxes = document.getElementsByName('rating')
        let selectedrate = 0;
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false;
                setMaxStars(checkThis.value);
            }
        }
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedrate = parseInt(checkbox.value, 10);
            }
        });

        setMaxStars(selectedrate);
    }

    const resetFilters = () => {
        setRangeValue(0);
        setEndTime(0);
        setMinPrice("0");
        setMinPrice1(0);
        setMaxPrice("0");
        setMaxPrice1(0);
        setMaxStars(0);
        handleSetStar(0)

        // Reset the checkboxes by unchecking them
        const checkboxes = document.getElementsByName('price');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        const endTimeCheckboxes = document.getElementsByName('endTime');
        endTimeCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        const ratingCheckboxes = document.getElementsByName('rating');
        ratingCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    };
    /*신뢰점수*/
    let [trust_popup, setTrust_popup] = useState(true);
    /*1대1문의*/
    let [temp8, setTemp8] = useState(true);
    let [message, setMessage] = useState([]);
    let [temp9, setTemp9] = useState(true);
    const [inquiry, setInquiry] = useState('');
    const handleInquiryChange = (e) => {
        setInquiry(e.target.value);
    };
    /*문의 세부 및 답변*/
    let [temp10, setTemp10] = useState(true);
    let [user_redate, setUser_redate] = useState("");
    let [user_content_inquiry, setUser_content_inquiry] = useState("");
    let [manager_redate, setManager_redate] = useState("");
    let [manager_content_inquiry, setManager_content_inquiry] = useState("");
    let [manager_status, setManager_status] = useState("");
    /*별점 */
    let [temp7, setTemp7] = useState(true);
    const [clicked, setClicked] = useState([false, false, false, false, false]);
    const array = [0, 1, 2, 3, 4]
    const handleStarClick = index => {
        let clickStates = [...clicked];
        for (let i = 0; i < 5; i++) {
            clickStates[i] = i <= index ? true : false;
        }
        setClicked(clickStates);
    };
    let score = clicked.filter(Boolean).length;
    let [starreservation, setStarreservation] = useState([]);
    /*필터 별점 */
    const [clicked1, setClicked1] = useState([false, false, false, false, false]);
    const array1 = [1, 2, 3, 4, 5]

    const handleSetStar = index => {
        let clickStates1 = [...clicked1];
        for (let i = 0; i < 6; i++) {
            clickStates1[i] = i <= index ? true : false;
        }
        setClicked1(clickStates1);
        setMaxStars(index);
    };
    return (
        <div className="App">
            <div className="home_user_App">
                <div className='wrap' >
                    <header id='header' className={`${temp1 == true ? "" : "header_hidden"}`} style={{
                        backgroundColor: 'white', // 헤더 배경색
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // 그림자 효과
                        position: 'sticky', // 스크롤과 함께 고정
                        top: 0, // 화면 상단에 고정
                        zIndex: 1, // 다른 요소 위에 나타나도록 설정
                        borderRadius: "20px"
                    }}>
                        <div className='logo'><a href="/home_owner"><div style={{ padding: "0px 40px 30px 40px", textAlign: "left" }}>
                            <img style={{ marginBottom: "-11px" }} src={Marker4}></img>
                            <div style={{ width: "150px", height: "11px", backgroundColor: "black", borderRadius: "40%", opacity: "0.1", marginLeft: "50px", marginTop: "-10px" }}></div>
                            <div style={{ marginLeft: "60px", marginTop: "-50px" }}>
                                <span style={{ fontWeight: "600", fontSize: "40px" }}>재고30</span>
                            </div>
                        </div></a></div>
                        <nav className='nav'>
                            <ul>
                                <li>
                                    <a className='alarm' onClick={() => {
                                        setTemp4(!temp4);
                                    }} style={{ cursor: "pointer", position: "relative" }}>
                                        <div style={{
                                            position: "absolute",
                                            right: "0", // right 위치 조절
                                            top: "0", // top 위치 조절
                                            width: "25px",
                                            height: "25px",
                                            marginRight: "30px", // 오른쪽 여백 추가
                                            backgroundColor: "red",
                                            color: "white",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center", // 텍스트를 가운데 정렬
                                            fontSize: "20px"
                                        }}>{alarmInfo.length + noticeAlarmInfo.length}</div>
                                        <NotificationsNoneIcon fontSize="large" />
                                    </a>
                                </li>

                                <li>
                                    <a onClick={() => {

                                        axios.get('/inquiry/view')
                                            .then(response => {
                                                setMessage(response.data);
                                            })
                                            .catch(error => {
                                                console.error('세션 데이터를 가져오는데 실패함', error);
                                            });
                                        setTemp8(!temp8);
                                    }} style={{ cursor: "pointer" }}>
                                        <MessageIcon fontSize="large" />
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => {
                                        if (a == 0) {
                                            setSwitch3(2);
                                            setSearch_store_switch(!search_store_switch);
                                            setA(1);
                                        } else if (a == 1) {
                                            if (b == 1) {
                                                setSwitch3(1);
                                                setSearch_store_switch(!search_store_switch);
                                                setB(0);
                                            } else if (b == 0) {
                                                setSwitch3(0);
                                                setSearch_store_switch(!search_store_switch);
                                            }
                                            setA(0);
                                        }
                                    }} style={{ cursor: "pointer" }}>
                                        <StarBorderIcon fontSize="large" />
                                    </a>
                                </li>
                                <li>
                                    <a href="/" onClick={() => {
                                        axios.get('/SessionLogout', {
                                        })
                                        window.alert("로그아웃되었습니다.");
                                    }
                                    }>
                                        <LogoutIcon fontSize="large" />
                                    </a>
                                </li>
                                <li>
                                    <a className='mypages' onClick={() => {
                                        setTemp1(!temp1);
                                    }} style={{ cursor: "pointer" }}>
                                        <AccountCircleIcon fontSize="large" /> <span>{userInfo.nickname}</span>
                                    </a>

                                </li>
                            </ul></nav>
                    </header>
                    <div style={{ width: "100%", height: "25px" }}></div>
                    <div style={{ width: "100%", height: "91%", overflow: "hidden" }}>
                        <div className={`contents_slide ${showFilter == true ? "" : "filter_slide"}`} style={{ width: "140%", height: "100%", display: "flex" }}>

                            <div style={{ width: "1%", height: "100%" }}></div>

                            <div className={`filter`} style={{ width: "19%", borderRadius: "50px", height: "99%", backgroundColor: "white", boxShadow: '0px 2px 5px rgba(0, 0, 0, 1)' }}>
                                <div className='filter_title' style={{ paddingTop: "20px", height: "3%", fontWeight: "600", fontSize: "30px", textAlign: "center", marginBottom: "30px" }}>
                                    필터
                                </div>

                                <div className='filter_contents' style={{ height: "92%" }}>

                                    <div className='filter_distance' style={{ height: "21%", borderTop: "1px solid rgb(180,180,180)", borderBottom: "1px solid rgb(180,180,180)" }}>
                                        <h1 style={{ fontSize: "20px", textAlign: "left", marginLeft: "30px", color: "#929292" }}>거리</h1>
                                        <div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="5"
                                                step="0.1"
                                                value={rangeValue}
                                                onChange={handleRangeChange}
                                                style={{ width: "70%", height: "80%", accentColor: "black" }}
                                            />

                                            {rangeValue != 0 && (
                                                <p style={{ fontWeight: "600", fontSize: "25px", color: "#828282" }}>
                                                    선택된 거리: <span style={{ color: "black", fontWeight: "700", fontSize: "30px" }}>{rangeValue} </span>Km</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='filter_price' style={{ height: "22%", borderBottom: "1px solid rgb(180,180,180)" }}>
                                        <h1 style={{ fontSize: "20px", textAlign: "left", marginLeft: "30px", marginBottom: "20px", color: "#929292" }}>가격</h1>
                                        <div style={{ marginBottom: "25px" }}>
                                        </div>
                                        <div>
                                            <TextField
                                                style={{ width: 150, height: 60, fontSize: 15 }}
                                                placeholder='0원'
                                                inputProps={{ style: { fontSize: 22 } }}
                                                InputLabelProps={{ style: { fontSize: 20, lineHeight: 60 } }}
                                                name='minprice'
                                                value={minPrice}
                                                onChange={(e) => {
                                                    setMinPrice(e.target.value);
                                                    setMinPrice1(addCommasToNumber(e.target.value));
                                                }}
                                            >

                                            </TextField>
                                            <span style={{ fontWeight: "600", padding: "0px 15px 0px 15px", display: "inline-block", marginTop: "8px", fontSize: "40px" }}>-</span>
                                            <TextField
                                                style={{ width: 150, height: 60, fontSize: 15 }}
                                                placeholder='최대 가격'
                                                inputProps={{ style: { fontSize: 22 } }}
                                                InputLabelProps={{ style: { fontSize: 20, lineHeight: 60 } }}
                                                name='maxprice'
                                                value={maxPrice}
                                                onChange={(e) => {
                                                    setMaxPrice(e.target.value);
                                                    setMaxPrice1(addCommasToNumber(e.target.value));
                                                }}
                                            >

                                            </TextField>
                                        </div>
                                        <div >

                                            {maxPrice != 0 && (
                                                <p style={{ fontWeight: "600", fontSize: "25px", color: "#828282" }}>
                                                    <span style={{ color: "black", fontWeight: "700", fontSize: "28px" }}>{minPrice1} - {maxPrice1} </span>원</p>
                                            )}
                                        </div>
                                    </div>


                                    <div className='filter_endtime' style={{ height: "20%", borderBottom: "1px solid rgb(180,180,180)" }}>
                                        <h1 style={{ fontSize: "20px", textAlign: "left", marginLeft: "30px", marginBottom: "10px", color: "#929292" }}>마감</h1>

                                        <div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="24" // 예: 24시간 범위 설정
                                                step="0.5" // 1시간씩 이동
                                                value={endTime}
                                                onChange={handleEndTimeChange}
                                                style={{ width: "70%", height: "80%", accentColor: "black" }}
                                            />
                                            {endTime != 0 && (
                                                <p style={{ fontWeight: "600", fontSize: "25px", color: "#828282" }}>
                                                    마감까지 <span style={{ color: "black", fontWeight: "700", fontSize: "25px" }}>{endTime}</span> 시간 이상 남음</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='filter_star' style={{ height: "20%" }}>
                                        <h1 style={{ fontSize: "20px", textAlign: "left", marginLeft: "30px", color: "#929292" }}>별점</h1>
                                        <div style={{ marginRight: "25px" }}>
                                            <div className='filter_point' style={{ width: "100%", marginTop: "0px", marginRight: "110px" }}>  {array1.map((index) => (
                                                <StarRateIcon
                                                    style={{
                                                        marginTop: "-10px"
                                                        , fontSize: "4rem"
                                                    }}
                                                    key={index}
                                                    name='rating'
                                                    onClick={() => handleSetStar(index)}
                                                    className={clicked1[index] && 'StarRateIcon'}
                                                    value={index}


                                                />))}
                                            </div>
                                            {maxStars != 0 && (
                                                <p style={{ fontWeight: "600", fontSize: "25px", color: "#828282" }}>
                                                    별점 : <span style={{ color: "black", fontWeight: "700", fontSize: "25px" }}>{maxStars}</span> 점 이상</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='filter_btn'>
                                        <button className='refresh_btn' style={{ width: "180px", marginTop: "5px", padding: "10px 50px", backgroundColor: "white", borderRadius: "50px", border: "1px solid rgba(0,0,0,0.3)", cursor: "pointer", fontWeight: "700", fontSize: "25px" }} onClick={
                                            resetFilters
                                        }>
                                            초기화
                                        </button>
                                        <button className="remove_regervation_Store" style={{ width: "180px", marginTop: "5px", padding: "10px 50px", borderRadius: "50px", border: "1px solid rgba(0,0,0,0.3)", cursor: "pointer", fontWeight: "700", fontSize: "25px", backgroundColor: "black", color: "white" }} onClick={() => {
                                            setSwitch3(1);
                                            setSearch_store_switch(!search_store_switch);
                                            setB(1);
                                            console.log(rangeValue);
                                            console.log(maxPrice);
                                            console.log(maxStars);
                                            console.log(endTime);
                                        }}>적용</button>
                                    </div>
                                </div>

                            </div>

                            <div style={{ width: "1%", height: "100%" }} ></div>

                            <div style={{ width: "49.5%", height: "100%" }}>
                                <div ref={mapContainer} style={{ width: "100%", height: "99%", borderRadius: "50px", boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}>

                                </div>
                            </div>

                            <div style={{ width: "1%", height: "100%" }} ></div>

                            <div className='detail_store' style={{ width: "20%", borderRadius: "20px", height: "100%", boxShadow: "3px 3px 3px 3px gray", position: "relative" }}>
                                <div style={{ width: "100%", height: "90px", marginTop: "10px", borderBottom: "1px solid gray" }}>
                                    <div className='detail_store_close' style={{ position: "absolute", top: "50px", left: "20px", fontSize: "25px", cursor: "pointer" }} onClick={() => {
                                        setShowFilter(!showFilter);
                                        setShowDetail(!showDetail);
                                    }}><ArrowBackIosIcon id={`${showFilter == true ? "aa" : null}`}></ArrowBackIosIcon></div>

                                    <div className='detail_store_name'><span>{selectedShop ? selectedShop.shopName : '선택된 가게 없음'}</span></div>
                                </div>
                                <div className='detail_store_ex1'>
                                    <div className='detail_store_select'>
                                        <div className={`select_btn1 ${search_switch1 == true ? "select_btn1_open" : ""}`} onClick={() => {
                                            if (search_switch2 == true) {
                                                setSearch_switch1(true);
                                                setSearch_switch2(false);
                                                setTapmenu(true);
                                            } else {

                                            }
                                        }}> home </div>
                                        <div className={`select_btn2 ${search_switch2 == true ? "select_btn2_open" : ""}`} onClick={() => {
                                            if (search_switch1 == true) {
                                                setSearch_switch1(false);
                                                setSearch_switch2(true);
                                                setTapmenu(false);
                                            } else {

                                            }
                                        }}> menu </div>
                                    </div>
                                    <div className={`find_text_id ${tapmenu == true ? "" : "tapmenu_hidden"}`} >

                                        <div className='detail_store_img'><img src={"/shopimages/" + `${selectedShop.imageFilename}`} alt={selectedShop.imageFilename} style={{ backgroundCover: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", height: "300px" }}></img></div>
                                        <div className='detail_store_name' style={{ marginTop: "20px", borderTop: "1px solid rgb(225, 223, 223)", fontSize: "28px", fontWeight: "600", textAlign: "center" }}><span>{selectedShop.shopame}</span></div>
                                        <div style={{ marginTop: "15px", textAlign: "center" }}><span style={{ fontSize: "20px", fontWeight: "600" }}>평점 : {selectedShop.rating}</span><span style={{ fontSize: "20px", color: "gray" }}>/5</span><StarBorderIcon style={{ marginBottom: "-2px" }}></StarBorderIcon></div>
                                        <div style={{ paddingBottom: "20px", borderBottom: "1px solid rgb(225, 223, 223)", textAlign: "center", fontSize: "20px" }}></div>
                                        <div style={{ textAlign: "left", fontSize: "20px", marginTop: "10px", borderBottom: "1px solid rgb(225, 223, 223)", paddingBottom: "10px" }}><WebAssetIcon style={{ marginLeft: "40px", marginBottom: "-6px", marginRight: "10px" }}></WebAssetIcon><a href="https://www.naver.com" style={{ textDecoration: "underline", color: "blue" }}>{selectedShop.shopWebsite}</a></div>
                                        <div style={{ textAlign: "left", fontSize: "20px", marginTop: "10px", borderBottom: "1px solid rgb(225, 223, 223)", paddingBottom: "10px" }}> <CallIcon style={{ marginLeft: "40px", marginBottom: "-6px", marginRight: "10px" }}></CallIcon><a>{selectedShop.shopTel}</a></div>
                                        <div><button className="fv_btn" onClick={() => {
                                            if (selectedShop) {
                                                axios.post('/member/bookmark/registration', selectedShop)
                                                    .then((response) => {
                                                        window.alert("즐겨찾기 추가 완료");
                                                        window.location.href = "/home_owner";
                                                    })
                                                    .catch(error => {
                                                        window.alert(error.response.data.result);
                                                    })
                                            }
                                        }
                                        }><StarBorderIcon style={{ fontSize: "xxLarger", marginBottom: "-4px", marginRight: "15px" }}></StarBorderIcon><span>즐겨찾기</span></button></div>
                                    </div>
                                    <div className={`detail_store_ex ${tapmenu == true ? "tapmenu_hidden" : ""}`}>
                                        <ul>
                                            {menuData.map((menuitem, index) => (
                                                <li key={index} style={{ width: "100%", height: "220px", marginLeft: "-20px", marginTop: "20px", borderBottom: "1px solid #eae7e7" }}>
                                                    <div style={{ width: "37%", height: "180px", float: "left", borderRadius: "20px", marginRight: "10px" }}><img src={"/itemimages/" + `${menuitem.image}`} alt={menuitem.image} style={{ backgroundCover: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", height: "100%" }}></img></div>
                                                    <div style={{ width: "45%", marginLeft: "125px", fontSize: "25px", fontWeight: "600", textAlign: "left", paddingLeft: "20px", cursor: "pointer" }}><span onClick={() => {
                                                        setTimeout(() => {
                                                            setSelectedMenuItem(menuitem);
                                                            setCViewVisible(true);
                                                            setReViewVisible(false);
                                                        }, 100);
                                                    }}>{menuitem.itemname}</span></div>
                                                    <div style={{ width: "55%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "rgb(150, 150, 150)" }}>{menuitem.itemnotice}</div>
                                                    <div style={{ width: "100%", marginTop: "10px", marginLeft: "-25px" }}><AccessAlarmIcon style={{ marginBottom: "-25px" }}></AccessAlarmIcon> {formatDate(menuitem.starttime)} </div>
                                                    <div> ~ </div>
                                                    <div style={{ width: "100%", marginLeft: "5px" }}><span> {formatDate(menuitem.endtime)} </span></div>
                                                    <div style={{ marginLeft: "-80px", width: "100%", height: "40px", lineHeight: "40px" }}><span style={{ textAlign: "right", textDecoration: "line-through", fontSize: "20px", fontWeight: "600", color: "rgb(150, 150, 150)", marginRight: "5px" }}>{menuitem.cost}</span><span style={{ fontSize: "25px", fontWeight: "600", color: "Red" }}>{menuitem.salecost}원</span></div>
                                                    <button style={{ width: "150px", height: "40px", borderRadius: "20px", backgroundColor: "black", color: "white", fontSize: "18px", fontWeight: "600", float: "right", cursor: "pointer" }} onClick={() => {
                                                        setTimeout(() => {
                                                            setSelectedMenuItem(menuitem);
                                                            setReViewVisible(true);
                                                            setCViewVisible(false);
                                                        }, 100);
                                                    }}><AddShoppingCartIcon style={{ marginBottom: "-5px", marginRight: "5px" }}></AddShoppingCartIcon>예약하기</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className={`c_view ${cViewVisible ? 'c_view_visible' : ''}`}>
                                            <div className="c_view_close" onClick={() => {
                                                setTimeout(() => {
                                                    setCViewVisible(false);
                                                }, 100)
                                                setSelectedMenuItem(null);
                                            }}> </div>
                                            <div style={{ marginTop: "30px" }}>
                                                {selectedMenuItem && (
                                                    <div>
                                                        <div style={{ marginLeft: "40px", width: "87%", height: "280px", borderRadius: "30px", boxShadow: "inset 0 20px 20px -20px #333, inset 0 -20px 20px -20px #333" }}>
                                                            <img
                                                                src={"/itemimages/" + `${selectedMenuItem.image}`}
                                                                alt={selectedMenuItem.image}
                                                                style={{
                                                                    objectFit: "cover", // 이미지가 영역에 맞게 조절되도록 함
                                                                    width: "100%", // 가로 크기를 100%로 지정
                                                                    height: "100%", // 세로 크기를 100%로 지정
                                                                    borderRadius: "30px", // 이미지에 둥근 테두리를 추가할 경우 지정
                                                                    position: "relative",
                                                                    zIndex: "-1"
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{ width: "85%", height: "auto", border: "1px solid rgb(150,150,150)", borderRadius: "7px", marginTop: "-20px", margin: "0 auto" }}>
                                                            <div style={{ margin: "20px 0px", paddingBottom: "20px", borderBottom: "1px solid rgb(195, 192, 192)" }}>
                                                                <span style={{ fontSize: "35px", fontWeight: "600" }}>{selectedMenuItem.itemname}</span>
                                                            </div>
                                                            <div style={{ paddingBottom: "10px", borderBottom: "1px solid rgb(195, 192, 192)" }}>
                                                                <div style={{ paddingBottom: "10px" }}>
                                                                    <span style={{ fontSize: "25px", fontWeight: "600" }}>가격 : </span><span style={{ textAlign: "right", textDecoration: "line-through", fontSize: "20px", fontWeight: "600", color: "rgb(150, 150, 150)", marginRight: "5px" }}>{selectedMenuItem.cost}</span>
                                                                    <span style={{ fontSize: "25px", fontWeight: "600", color: "Red" }}>{selectedMenuItem.salecost}원</span>
                                                                </div>
                                                                <button style={{ width: "150px", height: "50px", borderRadius: "20px", backgroundColor: "black", color: "white", fontSize: "20px", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                                                                    setTimeout(() => {
                                                                        setSelectedMenuItem(selectedMenuItem);
                                                                        setReViewVisible(true);
                                                                        setCViewVisible(false);
                                                                    }, 100);
                                                                }}><AddShoppingCartIcon style={{ marginBottom: "-5px", marginRight: "5px" }}></AddShoppingCartIcon>예약하기</button>
                                                                <span style={{ fontSize: "18px", marginLeft: "10px" }}>남은 수량 : {selectedMenuItem.quantity} </span>
                                                            </div>
                                                            <div style={{ fontSize: "18px", color: "rgb(95,95,95)", padding: "50px 0px", marginLeft: "40px", width: "80%", height: "auto", wordBreak: "break-all" }}>{selectedMenuItem.itemnotice}</div>
                                                            <div>
                                                                <div style={{ width: "100%", marginTop: "10px", marginLeft: "-5px", fontSize: "20px", marginBottom: "10px" }}>
                                                                    <AccessAlarmIcon style={{ marginBottom: "-7px" }}></AccessAlarmIcon>할인 시작일 : {formatDate(selectedMenuItem.starttime)}
                                                                </div>
                                                                <div style={{ width: "100%", marginLeft: "-5px", fontSize: "20px" }}>
                                                                    <AccessAlarmIcon style={{ marginBottom: "-7px" }}></AccessAlarmIcon>할인 마일일 :  {formatDate(selectedMenuItem.endtime)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`re_view ${reViewvisible ? 're_view_visible' : ''}`}>
                                            <div className="re_view_close" onClick={() => {
                                                setTimeout(() => {
                                                    setReViewVisible(false);
                                                }, 100)
                                            }}> </div>
                                            {selectedMenuItem && (
                                                <div style={{ marginTop: "30px" }}>
                                                    <div style={{ width: "98%", height: "280px", backgroundColor: "white", borderRadius: "5px", border: "1px solid rgb(150,150,150)", padding: "10px 0px 0px 10px" }}>
                                                        <div style={{ width: "37%", height: "50%", borderRadius: "20px", float: "left" }}><img src={"/itemimages/" + `${selectedMenuItem.image}`} alt={selectedMenuItem.image} style={{ backgroundCover: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", height: "100%" }}></img>
                                                        </div>
                                                        <div style={{ float: "left", margin: "20px 0px 0px 20px" }}><span style={{ fontSize: "25px", fontWeight: "600" }}>{selectedMenuItem.itemname}</span>
                                                        </div>
                                                        <div style={{ width: "55%", padding: "10px 0px 0px 20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "rgb(150, 150, 150)" }}>{selectedMenuItem.itemnotice}</div>
                                                        <div style={{ padding: "10px 0px 30px 0px" }}>
                                                            <span style={{ textDecoration: "line-through", fontSize: "20px", fontWeight: "600", color: "rgb(150, 150, 150)", marginRight: "5px" }}>{selectedMenuItem.cost}</span>
                                                            <span style={{ fontSize: "25px", fontWeight: "600", color: "Red" }}>{selectedMenuItem.salecost}원</span>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                                            <div style={{ fontWeight: "700", marginTop: "18px" }}>수량 : </div>
                                                            <TextField
                                                                placeholder='예약 하실 수량을 입력'
                                                                required
                                                                name="quantity"
                                                                onChange={(e) => {
                                                                    setQuantity(e.target.value);
                                                                }}
                                                                style={{ marginLeft: "10px" }}
                                                            ></TextField>
                                                        </div>
                                                        <div onClick={() => {
                                                            const formData = new FormData();

                                                            formData.append('memberidx', userInfo.memberIdx);
                                                            formData.append('shopidx', selectedShop.shopidx);
                                                            formData.append('itemidx', selectedMenuItem.itemidx);
                                                            formData.append('number', quantity);
                                                            formData.append('itemname', selectedMenuItem.itemname);
                                                            formData.append('shopname', selectedShop.shopName);
                                                            formData.append('name', userInfo.name);
                                                            formData.append('phone', userInfo.phone);
                                                            axios.post('/item/reservation', formData)
                                                                .then((response) => {

                                                                    window.alert("예약 완료");
                                                                    window.location.href = response.data;
                                                                })
                                                                .catch(error => {
                                                                    console.log(error);
                                                                    window.alert(error.response.data.result);
                                                                })
                                                            setReViewVisible(false);
                                                            setSelectedMenuItem(null);
                                                        }} style={{ cursor: "pointer", width: "150px", height: "40px", borderRadius: "20px", backgroundColor: "black", color: "white", fontSize: "18px", fontWeight: "600", margin: "0 auto", marginTop: "20px" }}><span style={{ lineHeight: "2" }}>[ SUBMIT ]</span></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "1%", height: "100%" }} ></div>
                        </div>
                    </div>
                </div>
                <div className={`${temp1 == true ? "popup_view_none" : "popup_view"}`} style={{ top: "50%" }}>
                    <div>
                        <Avatar
                            src={Image}
                            style={{ margin: '20px' }}
                            size={150}
                            onClick={() => { fileInput.current.click() }} />
                        <div><a style={{ color: "gray", textDecorationLine: 'underline', cursor: 'pointer' }}
                            onClick={() => {
                                if (userInfo.social == "normal") {//이부분 수정하기
                                    navigate("/edit_member_information");
                                } else {//이부분 수정하기
                                    navigate("/edit_member_information_social");
                                }

                            }}>회원 정보 수정</a></div>
                        <div><h1 style={{ margin: "20px 0px 30px 30px" }}>{userInfo.nickname}
                            <a onClick={() => {
                                setTemp2(false)
                            }}><DriveFileRenameOutlineIcon fontSize="midium" className="popup_log_out" style={{ cursor: "pointer", margin: "0px 0px -5px 7px" }}></DriveFileRenameOutlineIcon></a>
                            <a href="/" onClick={() => {
                                window.alert("로그아웃되었습니다.");
                            }
                            } style={{ cursor: "pointer" }}>
                                <ExitToAppIcon fontSize="midium" className="popup_log_out" style={{ margin: "0px 0px -5px 7px" }} />
                            </a>
                        </h1>
                        </div>
                    </div>

                    <div id="popsec1" style={{ cursor: "pointer" }}>
                        <a onClick={() => {

                            axios.get('/member/bookmark/check')
                                .then(response => {
                                    setShopsData(response.data);

                                    setTemp3(!temp3);
                                })
                                .catch(error => {
                                    console.error('세션 데이터를 가져오는데 실패함', error);
                                });

                            setTemp3(!temp3);
                        }} style={{ cursor: "pointer" }} ><span>즐겨 찾기</span></a>

                    </div>
                    <div id="popsec2" style={{ cursor: "pointer" }}>
                        <a onClick={() => {
                            setConfirmstate("wait")
                            setTapmenu1(true);
                            axios.get('/item/reservation/getreservations', {
                                params: {
                                    confirm: confirmstate
                                }
                            })
                                .then(response => {
                                    setRegervation(response.data);
                                    setTemp6(!temp6);
                                })
                                .catch(error => {
                                    console.error('세션 데이터를 가져오는데 실패함', error);
                                });

                            setTemp6(!temp6);
                        }} style={{ cursor: "pointer" }} ><span>예약 확인</span></a>
                    </div>
                    <div id="popsec3" style={{ cursor: "pointer", alignItems: "center", position: "relative" }}>
                        <div style={{ alignItems: "center" }}>
                            <span onClick={() => {
                                setTrust_popup(!trust_popup);
                            }}><span style={{ fontSize: "28px" }}></span>신뢰도</span>
                            <div className={`${trust_popup == true ? "trust_popup" : null}`} style={{ backgroundColor: "white", height: `${10 * 64.8}px`, width: "30px", borderRadius: "50px", position: "absolute", top: "-438px", right: "-58px", boxShadow: "5px 5px 5px 5px gray", border: "1px solid black" }}>
                                <div>{userInfo.trust}</div>
                                <div style={{ backgroundColor: getBarColor(userInfo.trust), borderRadius: "20px", height: `${userInfo.trust * 60}px`, width: "20px", margin: "0 auto", marginTop: "5px", position: "absolute", bottom: "5px", left: "5px" }}></div> {/* 연두색 바 */}
                            </div>
                        </div>
                    </div>
                    <div id="popsec2" style={{ cursor: "pointer" }}>
                        <a href="owner_main_page"><span>내 가게</span></a>
                    </div>
                    <button className="popup_btn" onClick={() => {
                        setTemp1(!temp1)
                    }}><a>[ CLOSE ]</a></button>

                </div>

                <div className={`${temp2 == true ? "popup_view2_none" : "popup_view2"}`} >
                    <div className='nicname_change'>닉네임 수정</div>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" >
                                    <PermIdentityIcon />
                                </InputAdornment>
                            ),
                        }}
                        placeholder={`현재 닉네임: ${userInfo.nickname} (최대15자)`}
                        label="ID"
                        required
                        name="id"
                        type="email"
                        autoComplete="id"
                        sx={{
                            width: { sm: 200, md: 450 },
                            "& .MuiInputBase-root": {
                                height: 60
                            }
                        }}
                        autoFocus
                        value={nicname}
                        onChange={(e) => {
                            setNicname(e.target.value);
                        }} />

                    <a className='nicname_change_btn' onClick={() => {
                        axios.put('/member/update/nickname', {

                            nickname: nicname,

                        }).then(response => {//데이터를받아오는게성공시 다른페이지호출
                            setNicname("");
                            setRecall(!recall);
                            window.alert("닉네임변경 성공");


                        }).catch(error => {//데이터를받아오는게 실패시 오류 메세지출력하고 다시 login페이지 호출
                            setNicname("");
                            window.alert(error.response.result);
                        })
                        setTemp2(!temp2);
                    }} style={{ cursor: "pointer" }}>완료</a>
                    <div style={{ position: "absolute", top: "10px", right: "25px", fontSize: "25px", fontWeight: "700", cursor: "pointer" }} onClick={() => {
                        setTemp2(!temp2)
                    }}>X</div>
                    <ul className="nicname_change_list" style={{ marginLeft: "20px", textAlign: "left" }}>
                        <li style={{ listStyleType: "circle", color: "black" }}>중복 닉네임 불가</li>
                        <li style={{ listStyleType: "circle", color: "black" }}>길이는 최대 15자 이내</li>
                    </ul>
                    <div className='warning'>
                        <div className='text'>
                            재고30 닉네임 정책에 맞지 않는 닉네임은 <br />닉네임변경이 되지 않으므로 주의해주세요
                        </div>
                    </div>
                </div>
                <div id={`${temp3 == true ? "fv_view_none" : "fv_view"}`}>
                    <span className="fv_view_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                        setTemp3(!temp3);
                    }}>X</span>
                    <div className='fv_view_title'>
                        <span>즐겨찾기</span><span style={{ fontSize: "18px", textAlign: "right" }}><RoomIcon fontSize="small" />{shopsData.length}개</span>
                    </div>

                    <div className='fv_view_edit' style={{ border: "2px solid gray", marginLeft: "210px", color: "rgba(0,0,0,0.8)" }} >
                        <EditNoteIcon className="fv_view_EditNoteIcon" fontSize="large" style={{ marginLeft: "10px" }} /><span style={{ padding: "5px 0px", fontSize: "20px" }} onClick={() => {
                            setTemp5(!temp5)
                        }}> 편집</span>
                    </div>
                    <div className='divide'><span style={{ display: "none" }}>asd</span></div>
                    <div className='fv_store_content' style={{ position: "relative" }}>

                        <div style={{ marginTop: "20px" }}>
                            {shopsData.map((store, index) => (
                                <div key={index} className="fv_store" style={{ display: "flex", borderBottom: "2px solid rgba(0,0,0,0.3)" }}>
                                    <div className='fv_store_image'>
                                        <img src={"/shopimages/" + `${store.imageFilename}`} alt={store.imageFilename} style={{ backgroundCover: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", height: "100px", float: "Left" }} />
                                    </div>
                                    <div style={{ width: "1000px", marginTop: "10px", lineHeight: "1.8" }}>
                                        <div className='fv_store_name' style={{ textAlign: "left" }}>
                                            {store.shopName}
                                        </div>
                                        <div className='fv_store_address'>
                                            {store.shopAddress}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`${temp5 == true ? "fv_store_edite_none" : 'fv_store_edite'}`}>
                    <span className="fv_view_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                        setTemp5(!temp5);
                    }}>X</span>
                    <div className='fv_store_edite_title' style={{ marginTop: "20px" }}>
                        <span>편집</span><span style={{ fontSize: "18px", textAlign: "right" }}><RoomIcon fontSize="small" />{selectedStores.length}개</span>
                    </div>
                    <div className='divide' style={{ height: "10px" }}><span style={{ display: "none" }}>asd</span></div>
                    <div className="fv_store_list" style={{ marginTop: "20px", width: "100%", height: "70%" }}>
                        {shopsData.map((store, index) => (
                            <div key={index} className="fv_store" style={{ display: "flex", borderBottom: "2px solid rgba(0,0,0,0.3)", position: "relative" }}>
                                <div className='fv_store_image'>
                                    <img src={"/shopimages/" + `${store.imageFilename}`} alt={store.imageFilename} style={{ backgroundCover: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", height: "100px", float: "Left" }} />
                                </div>
                                <div style={{ width: "1000px", marginTop: "10px", lineHeight: "1.8" }}>
                                    <div className='fv_store_name' style={{ textAlign: "left" }}>
                                        {store.shopName}
                                    </div>
                                    <div className='fv_store_address'>
                                        {store.shopAddress}
                                    </div>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={selectedStores.includes(store)}
                                    onChange={(e) => {
                                        let isChecked = e.target.checked;
                                        let address = store.shopAddress;
                                        if (isChecked) {
                                            if (selectedStores.some(item => item.shopAddress === address)) {
                                                // 이미 선택된 주소인 경우, 아무것도 하지 않음
                                            } else {
                                                // 새로운 배열을 생성하여 선택된 항목을 추가
                                                let copy = [...selectedStores, store];
                                                setSelectedStores(copy);
                                            }
                                        } else {
                                            // 선택 해제된 경우, 해당 주소를 가진 항목을 배열에서 제거
                                            setSelectedStores(prevStores => prevStores.filter(item => item.shopAddress !== address));
                                        }
                                    }}
                                    style={{ position: "absolute", top: "0", right: "0", width: "25px", height: "25px", cursor: "pointer" }} />

                            </div>
                        ))}
                    </div>
                    <button className="remove_fv_Store" style={{ marginTop: "10px", padding: "10px 50px", borderRadius: "50px", border: "1px solid rgba(0,0,0,0.3)", cursor: "pointer", fontWeight: "700", fontSize: "25px" }} onClick={() => {
                        console.log(selectedStores);
                        axios.post('/member/bookmark/delete', selectedStores
                        ).then(response => {//데이터를받아오는게성공시 다른페이지호출
                            setShopsData(response.data);
                            window.alert("수정 완료");
                            setSelectedStores([]);

                        }).catch(error => {//데이터를받아오는게 실패시 오류 메세지출력하고 다시 login페이지 호출
                            setSelectedStores([]);
                            window.alert(error.response.result);
                        })
                        setTemp5(!temp5);
                    }}>
                        삭제 {selectedStores.length}
                    </button>
                </div>

                <div id={`${temp4 == true ? "al_view_none" : "al_view"}`}>
                    <span className="fv_view_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                        setTemp4(!temp4);
                    }}>X</span>
                    <div className='fv_view_title'>
                        <span>알림</span>
                    </div>
                    <div style={{ borderTop: "2px solid rgba(0,0,0,0.3)" }}>
                        {combinedAlarms.map((alarm, index) => (
                            <div key={index} className="fv_store" style={{ display: "block", borderBottom: "2px solid rgba(0,0,0,0.3)" }}>
                                <a style={{ color: "red", fontSize: "25px" }}>new &nbsp;</a>
                                {alarm.shopname ? (
                                    <a style={{ fontSize: "25px" }}><b>{alarm.shopname}</b></a>
                                ) : (
                                    <a style={{ fontSize: "25px" }}><b>{alarm.title}</b></a>
                                )}
                                <br></br>
                                <a style={{ fontSize: "20px" }}>
                                    {alarm.shopname
                                        ? "새 할인상품이 등록되었습니다."
                                        : "새 공지사항이 등록되었습니다."}
                                    <a style={{ color: "red", fontSize: "20px", float: "right" }}>
                                        ({alarm.before}시간 전)
                                    </a>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div id={`${temp6 == true ? "regervation_none" : "regervation_view"}`}>
                    <span className="regervation_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                        setTemp6(!temp6);
                        setSearch_switch3(true);
                        setSearch_switch4(false);
                        setTapmenu1(false);
                        setSelectedregervationStores([]);
                    }}>X</span>
                    <div className='regervation_title' style={{ borderBottom: "2px solid rgba(0,0,0,0.3)", paddingBottom: "30px" }}>
                        <span>예약 내역</span>
                    </div>
                    <div className='reservation_check' >
                        <div className='reservation_select' style={{ position: "fixed" }}>
                            <a className={`res_select_btn1 ${search_switch3 == true ? "res_select_btn1_open" : ""}`} onClick={() => {
                                if (search_switch4 == true) {
                                    setConfirmstate('wait');
                                    setSearch_switch3(true);
                                    setSearch_switch4(false);
                                    setTapmenu1(true);
                                    console.log("confirm = " + confirmstate)
                                    axios.get('/item/reservation/getreservations', {
                                        params: {
                                            confirm: 'wait'
                                        }
                                    })
                                        .then((response) => {
                                            setRegervation(response.data);
                                            console.log(tapmenu1);
                                        })
                                        .catch(error => {
                                            setRegervation([]);
                                            window.alert(error.response.data.result);
                                        })
                                }
                                else {

                                }
                            }}> waiting </a>
                            <a className={`res_select_btn2 ${search_switch4 == true ? "res_select_btn2_open" : ""}`} onClick={() => {
                                if (search_switch3 == true) {
                                    setConfirmstate('true');
                                    setSearch_switch3(false);
                                    setSearch_switch4(true);
                                    setTapmenu1(false);
                                    setSelectedregervationStores([]);
                                    console.log(confirmstate)
                                    axios.get('/item/reservation/getreservations', {
                                        params: {
                                            confirm: 'true',
                                        }
                                    })
                                        .then((response) => {
                                            setRegervation(response.data);
                                            console.log(123)
                                            console.log(response.data);
                                        })
                                        .catch(error => {
                                            window.alert(error.response.data.result);
                                        })
                                }
                                else {

                                }
                            }}> complete </a>
                        </div>
                        <div className={`find_text_id ${tapmenu1 == true ? "" : "tapmenu1_hidden"}`} >
                            <div className="regervation_content" style={{ width: "90%", height: "380px", paddingTop: "50px", margin: "0 auto" }}>
                                {regervation.map((store, index) => (
                                    <div key={index} className="regervation_store" style={{ display: "flex", borderBottom: "2px solid rgba(0,0,0,0.3)", position: "relative" }}>
                                        <div className='regervation_store_image'>
                                            <img src={"/itemimages/" + `${store.image}`} alt={store.imagefilename} style={{ backgroundCover: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", height: "100px", float: "Left" }} />
                                        </div>
                                        <div style={{ width: "1000px", marginTop: "10px", lineHeight: "1.5" }}>
                                            <div className='regervation_store_name' style={{ textAlign: "left" }}>
                                                {store.shopname}
                                            </div>
                                            <div className='fv_store_address' style={{ fontSize: "15px" }}>
                                                {store.shopaddress}
                                            </div>

                                            <div className='fv_store_address' style={{ display: "flex" }}>
                                                <div>
                                                    {store.itemname}
                                                </div>
                                                <div style={{ marginLeft: "20px" }}>
                                                    수량: {store.number}
                                                </div>
                                            </div>
                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={selectedregervationStores.includes(store)}
                                            onChange={(e) => {
                                                let isChecked = e.target.checked;
                                                let address = store.shopaddress;
                                                let rsidx = store.reservationidx;
                                                if (isChecked) {
                                                    if (selectedregervationStores.some(item => item.shopaddress === address)) {
                                                        // 이미 선택된 주소인 경우, 아무것도 하지 않음
                                                        if (selectedregervationStores.reservationidx !== store.reservationidx) {
                                                            let copy = [...selectedregervationStores, store];
                                                            setSelectedregervationStores(copy);
                                                        }
                                                    } else {
                                                        // 새로운 배열을 생성하여 선택된 항목을 추가
                                                        let copy = [...selectedregervationStores, store];
                                                        setSelectedregervationStores(copy);
                                                    }
                                                } else {
                                                    // 선택 해제된 경우, 해당 주소를 가진 항목을 배열에서 제거
                                                    setSelectedregervationStores(prevStores => prevStores.filter(item => item.reservationidx !== rsidx));
                                                }
                                            }}
                                            style={{ position: "absolute", top: "0", right: "0", width: "25px", height: "25px", cursor: "pointer" }} />

                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`find_text_pw ${tapmenu1 == true ? "tapmenu1_hidden" : ""}`}>
                            <div className="regervation_content" style={{ width: "90%", height: "380px", paddingTop: "50px", margin: "0 auto" }}>
                                {regervation.map((store, index) => (
                                    <div key={index} className="regervation_store" style={{ display: "flex", borderBottom: "2px solid rgba(0,0,0,0.3)", position: "relative" }}>
                                        <div className='regervation_store_image'>
                                            <img src={"/itemimages/" + `${store.image}`} alt={store.imagefilename} style={{ backgroundCover: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", height: "100px", float: "Left" }} />
                                        </div>
                                        <div style={{ width: "1000px", marginTop: "10px", lineHeight: "1.5" }}>
                                            <div className='regervation_store_name' style={{ textAlign: "left" }}>
                                                {store.shopname}
                                            </div>
                                            <div className='fv_store_address' style={{ fontSize: "15px" }}>
                                                {store.shopaddress}
                                            </div>

                                            <div className='fv_store_address' style={{ display: "flex" }}>
                                                <div>
                                                    {store.itemname}
                                                </div>
                                                <div style={{ marginLeft: "20px" }}>
                                                    수량: {store.number}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button style={{ position: "absolute", top: "50px", right: "0", borderRadius: "20px", width: "80px", height: "35px", cursor: "pointer" }} onClick={() => {
                                                setTemp7(!temp7);
                                                setStarreservation(store);
                                            }}>
                                                <span>별점</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="remove_regervation_Store" style={{ marginTop: "20px", padding: "10px 50px", borderRadius: "50px", border: "1px solid rgba(0,0,0,0.3)", cursor: "pointer", fontWeight: "700", fontSize: "25px" }} onClick={() => {
                        console.log(selectedregervationStores);
                        axios.post('/item/reservation/cancel', selectedregervationStores
                        ).then(response => {//데이터를받아오는게성공시 다른페이지호출
                            window.alert("취소 완료");
                            axios.get('/item/reservation/getreservations')
                                .then(response => {
                                    setRegervation(response.data);
                                    setSelectedregervationStores([]);
                                })
                                .catch(error => {
                                    console.error('세션 데이터를 가져오는데 실패함', error);
                                });

                        }).catch(error => {//데이터를받아오는게 실패시 오류 메세지출력하고 다시 login페이지 호출
                            setSelectedregervationStores([]);
                            window.alert(error.response.data.result);
                        })
                        setTemp6(!temp6);
                    }}>
                        삭제 {selectedregervationStores.length}
                    </button>
                </div>
            </div>

            <div className={`${temp7 == true ? "star_review_none" : 'star_review'}`}>
                <span className="star_review_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                    setTemp7(!temp7);
                }}>X</span>
                <div className='point' style={{ width: "100%", marginTop: "10px", marginRight: "110px" }}> <div style={{ borderBottom: "1px solid rgb(150,150,150)", paddingBottom: "20px" }}><span style={{ fontSize: "25px", fontWeight: "600" }}> 평점 작성 하기</span></div> {array.map((index) => (
                    <StarRateIcon
                        style={{
                            marginTop: "50px"
                            , fontSize: "5rem"
                        }}
                        key={index}
                        onClick={() => handleStarClick(index)}
                        className={clicked[index] && 'StarRateIcon'}
                    />))}
                </div>
                <div><button onClick={() => {
                    setTemp7(!temp7);
                    console.log(starreservation.shopidx)
                    const formdata = new FormData();
                    formdata.append("shopidx", starreservation.shopidx);
                    formdata.append("rating", score);
                    if (score) {
                        axios.post('/setRating', formdata)
                            .then(response => {
                                console.log(starreservation.shopidx)
                                window.alert("별점 추가 완료");
                                window.location.href = response.data;
                            }).catch(error => {
                                window.alert(error.response.data.result);
                            })
                    }
                }}
                    style={{ width: "200px", height: "40px", borderRadius: "15px", backgroundColor: "black", color: "white", fontSize: "20px", fontWeight: "600", marginTop: "40px", cursor: "pointer" }}><span>Submit</span></button></div>

            </div>
            {/*문의함*/}
            <div id={`${temp8 == true ? "inquiry_none" : "inquiry"}`}>
                <span className="fv_view_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                    setTemp8(!temp8);
                }}>X</span>
                <div className='inquiry_title'>
                    <span>문의함</span>
                </div>

                <div className='divide'><span style={{ display: "none" }}>asd</span></div>
                <div className='inquiry_content' style={{ position: "relative" }}>
                    <div className="box_hover" >

                        {message.map((message, index) => (
                            <div key={index} className="inquiry_box" style={{ borderBottom: "2px solid rgba(0,0,0,0.3)" }} onClick={() => {
                                setUser_redate(message.redate);
                                setUser_content_inquiry(message.content_inquiry);
                                setManager_redate(message.answer_redate);
                                setManager_content_inquiry(message.content_answer);
                                setManager_status(message.status);
                                setTemp10(!temp10);
                            }}>
                                <div style={{ lineHeight: "1.8" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div className='inquiry_box_date'>
                                            <div>작성일: {message.redate}</div> <div>상태: <span style={{ textAlign: "right", color: message.status === "답변 대기" ? "rgb(237, 87, 71)" : "rgb(17, 195, 239)" }}>{message.status}</span></div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <div className='inquiry_box_content' style={{ width: "80%" }}>
                                            {message.content_inquiry}
                                        </div>
                                        <div className='inquiry_box_content_remove' style={{ width: "20%" }} onClick={() => {
                                            axios.delete('/inquiry/delete', {
                                                params: {
                                                    inquiryidx: message.inquiryidx,
                                                }
                                            }).then(response => {
                                                window.alert("삭제 성공.");
                                                axios.get('/member/bookmark/check')
                                                    .then(response => {
                                                        setMessage(response.data);
                                                    })
                                                    .catch(error => {
                                                        console.error('세션 데이터를 가져오는데 실패함', error);
                                                    });

                                                setTemp8(!temp8);
                                            }).catch(error => {
                                                console.error('세션 데이터를 가져오는데 실패함', error);
                                            });
                                        }}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: "30px" }}>
                    <span className='inquiry_request' style={{ marginTop: "20px", padding: "10px 50px", borderRadius: "50px", border: "1px solid rgba(0,0,0,0.3)", cursor: "pointer", fontWeight: "700", fontSize: "25px" }} onClick={() => {
                        setTemp9(!temp9);
                    }}>1:1문의</span>
                </div>
            </div>

            <div id={`${temp9 == true ? "inquiry_request_go_none" : "inquiry_request_go"}`}>
                <span className="inquiry_request_go_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                    setTemp9(!temp9);
                }}>X</span>
                <div className='inquiry_request_go_title' style={{ marginTop: "20px" }}>
                    <span>1:1 Q&A</span>
                </div>
                <div className='divide' style={{ height: "10px" }}><span style={{ display: "none" }}>asd</span></div>
                <div className="inquiry_request_go_content" style={{ marginTop: "10px" }}>
                    <div className='inquiry_request_go_content_title'>
                        문의 작성
                    </div>
                    <div>
                        <textarea
                            className="inquiry_textarea"
                            placeholder="문의 내용을 작성하세요..."
                            value={inquiry}
                            onChange={handleInquiryChange}
                            style={{ width: "90%", height: "200px", resize: "vertical", fontSize: "25px", marginTop: "10px", maxHeight: "300px" }}
                        ></textarea>
                    </div>
                    <div className="inquiry_request_go_content_warning">
                        <span >악성글을 작성하게 되면 회원이<br /> <strong style={{ color: "blue" }}>강제 탈퇴 처리</strong>가 될수도 있습니다.</span>
                    </div>
                </div>
                <button className="inquiry_request_go_btn" style={{ marginTop: "10px", padding: "10px 50px", borderRadius: "50px", border: "1px solid rgba(0,0,0,0.3)", cursor: "pointer", fontWeight: "700", fontSize: "25px" }} onClick={() => {
                    const formData = new FormData();

                    formData.append('content_inquiry', inquiry);
                    axios.post('/inquiry/register', formData
                    ).then(response => {
                        window.alert("작성 성공.");
                        axios.get('/inquiry/view')
                            .then(response => {
                                setMessage(response.data);
                            })
                            .catch(error => {
                                console.error('세션 데이터를 가져오는데 실패함', error);
                            });
                    }).catch(error => {
                        console.error('세션 데이터를 가져오는데 실패함', error);
                    });
                    setTemp9(!temp9);
                }}>
                    작성하기
                </button>
            </div>
            {/*각 문의함 세부내용 및 답변*/}
            <div id={`${temp10 == true ? "inquiry_answer_none" : "inquiry_answer"}`}>
                <span className="inquiry_answer_close" style={{ fontSize: "25px", position: "absolute", top: "10px", right: "19px", cursor: "pointer", padding: "0px 10px", fontSize: "25px", fontWeight: "700" }} onClick={() => {
                    setTemp10(!temp10);
                    setManager_redate("");
                    setManager_content_inquiry("");
                }}>X</span>
                <div className='inquiry_answer_title'>
                    <span>문의함</span>
                </div>

                <div className='divide'><span style={{ display: "none" }}>asd</span></div>
                <div className='inquiry_answer_content' style={{ position: "relative" }}>
                    <div className="inquiry_answer_user" >
                        <div className='inquiry_answer_user_redate'>
                            <div>작성일: {user_redate}</div> <div>상태: <span style={{ textAlign: "right", color: manager_status === "답변 대기" ? "rgb(237, 87, 71)" : "rgb(17, 195, 239)" }}>{manager_status}</span></div>
                        </div>
                    </div>
                    <div className="inquiry_answer_manager" >
                        <div className="inquiry_answer_manager_redate">답변일 : {manager_redate}</div>
                        <div className="inquiry_answer_manager_content">{manager_content_inquiry}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home_owner;

