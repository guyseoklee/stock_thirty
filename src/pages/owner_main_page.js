import React, { useState } from 'react';
import './../App.css';
import axios from "axios";
import { useEffect, useRef } from 'react';
import SearchIcon from "@material-ui/icons/Search";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Avatar from 'react-avatar';
import StoreIcon from '@mui/icons-material/Store';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { Brightness1 } from '@material-ui/icons';
import zIndex from '@material-ui/core/styles/zIndex';
import { useNavigate } from "react-router-dom";
import EventNoteIcon from '@mui/icons-material/EventNote';
import UpdateIcon from '@mui/icons-material/Update';
function Owner_main_page() {
    let navigate = useNavigate();
    const [userInfo, setUserInfo] = useState("");
    let [recall, setRecall] = useState(false);
    let [temp1, setTemp1] = useState(true);
    let [temp, setTemp] = useState(true);
    const fileInput = useRef(null);
    let [temp2, setTemp2] = useState(true);
    let [temp3, setTemp3] = useState(true);
    let [shopsData, setShopsData] = useState([]);
    function switchTemp() {
        setTemp(!temp);
    }
    useEffect(() => {
        // 스프링에서 세션 데이터를 가져오는 호출
        axios.get('/getSessionMember')
            .then(response => {
                const userData = response.data;
                console.log(userData.redirect)
                if (userData.redirect) {
                    console.log("페이지 이동");
                    window.location.href = userData.redirect;
                } else {
                    setUserInfo(userData);
                    console.log("세션데이터가 존재");
                    console.log(userData.id);
                }
            })
            .catch(error => {
                console.error('세션 데이터를 가져오는데 실패함', error);
            });
    }, [recall]);
    let [noticepost,setNoticePost] = useState([{noticeIdx:"1",title:"sss",content:"ssssdsdsdsdsdsdasdsadsadsacasdacssadasdasdasdasdsadasdasdasdasdasdasdsadasdasdasdsa",noticeDate:"2023-10-23"},{noticeIdx:"1",title:"sss",content:"ssss",noticeDate:"2023-10-23"},{noticeIdx:"4",title:"sss",content:"ssss",noticeDate:"2023-10-23"},{noticeIdx:"2",title:"aaaa",content:"aaaaa",noticeDate:"2023-10-23"},{noticeIdx:"3",title:"dddd",content:"ddddd",noticeDate:"2023-10-23"}]);
    useEffect(() => {
        axios.get('/manager/notice/readall')
            .then(response => {
                const noticepost = response.data;
                console.log(noticepost);
                console.log(noticepost.redirect)
                if (noticepost.redirect) {
                    console.log("페이지 이동");
                    window.location.href = noticepost.redirect;
                } else {
                    setNoticePost(noticepost);
                    console.log("세션데이터가 존재");
                }
            },[userInfo]);
    }, []);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const postsPerPage = 4;//페이지당 게시글수
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = noticepost.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div>
            <div className='owner_main_pageWrap' >
                <header id='header' className={`${temp1 == true ? "" : "header_hidden"}`} style={{
                    backgroundColor: 'white', // 헤더 배경색
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // 그림자 효과
                    position: 'sticky', // 스크롤과 함께 고정
                    top: 0, // 화면 상단에 고정
                    zIndex: 1, // 다른 요소 위에 나타나도록 설정
                    borderRadius: "20px"
                }}>
                    <div className='logo'><a href="/owner_main_page">재고 30 </a></div>
                    <nav className='nav'>
                        <ul>
                            <li>
                                <a onClick={() => {
                                    setTemp(switchTemp);
                                }} style={{ cursor: "pointer" }} href='/owner_storelist'>
                                    내가게
                                </a>
                            </li>
                            <li>
                                <a href="/owner_addmenu" style={{ cursor: "pointer" }}>
                                    상품등록
                                </a>
                            </li>
                            <li>
                                <a href="/owner_notice">
                                    공지사항
                                </a>
                            </li>
                            <li>
                                <a href="/">
                                    로그아웃
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
                <div className={`banner ${temp1 == true ? "" : "banner_hidden"}`} style={{ display: "flex" }}>
                    <div className="baner_img1" style={{ position: "relative" }}>
                        <a><img style={{ width: "100%", height: "654px", filter: "brightness(60%)" }} src='https://i.pinimg.com/564x/a6/54/72/a65472b2e830a9fc1d5cff837443656c.jpg'></img>
                        </a>
                        <div className='text1' style={{ position: "absolute", top: "35%", left: "50%" }} >
                            <span style={{ fontSize: '70px', fontWeight: "1000" }}>SHOP</span><br />
                            <span >본인 가게를 등록해보세요</span>
                            <div className='own_main_btn1' style={{ position: "absolute", top: "165%", left: "65%" }}>

                                <button className='own_main_btn' style={{ cursor: "pointer" }} onClick={() => {
                                    navigate("/owner_storelist");
                                }}><span>ADD NOW</span></button>
                            </div>
                        </div>

                    </div>

                    <div className="baner_img2" style={{ position: "relative" }}>
                        <a><img style={{ width: "100%", height: "654px", filter: "brightness(60%)" }} src='https://i.pinimg.com/564x/20/81/1f/20811fd104585bc0543457408647ee23.jpg'></img></a>
                        <div className='text2' style={{ position: "absolute", top: "35%", left: "50%" }}>
                            <span style={{ fontSize: '70px', fontWeight: "1000" }}>ITEM</span><br />
                            <span>가게 떨이를 등록해보세요</span>
                            <div className='own_main_btn2' style={{ position: "absolute", top: "125%", left: "25%" }}>
                                <button className='own_main_btn' style={{ cursor: "pointer" }} onClick={() => {
                                    navigate("/owner_addmenu");
                                }}><span>ADD NOW</span></button>
                            </div>
                        </div>


                    </div>

                </div>

                <div className='contents'>
                    <div className='text'><span>내 가게</span></div>
                    <div className={`content1 ${temp1 == true ? "" : "contents_hidden"}`}>
                        <div>
                            <div style ={{fontSize:"20px", textAlign:"left",lineHeight:"2"}} className='cont_text0'>
                                <div><span>가게 등록 및 관리</span></div>
                                <div><span>가게 정보 관리는 다음 페이지이용</span></div>
                                <div style={{borderBottom:"4px solid black", borderRadius:"30px",width:"100px",marginTop:"10px"}}><span></span></div>
                            </div>
                            <div className='cont_text1' style={{marginLeft:"80px",marginTop:"130px"}}>
                                <span style={{ width:"400px",fontSize: "50px", fontWeight: "600", textAlign: "left", marginBottom: "10px" }}>내 가게 확인하기</span>
                                <span>사장님들의 가게를 등록해보세요! 등록한 가게들을 한 눈에 살펴 볼 수 있고, 가게에 대한 정보를 입력해 홍보해보세요</span>
                                <span style={{ marginTop: "30px" }}><a style={{ borderBottom: "1px dashed black", cursor:"pointer" }} onClick={()=>{navigate("/owner_storelist");}}>알아보기 {">"}</a></span>
                            </div>                                
                            <a style={{ marginLeft: "-430px", marginTop: "-450px", position: "absolute" }}><img style={{ width: "900px" , filter: "contrast(130%)"}} src='https://i.pinimg.com/564x/a6/54/72/a65472b2e830a9fc1d5cff837443656c.jpg'></img><div style={{ marginLeft: "200px", marginTop: "-500px", width: "1000px", height: "550px", backgroundColor: "#f3eded" }}></div></a>
                        </div>
                    </div>
                    <div className='text'><span>상품 등록</span></div>
                    <div className={`content2 ${temp1 == true ? "" : "contents_hidden"}`}>
                        <div>
                            <div style ={{fontSize:"20px", textAlign:"left",lineHeight:"2",marginTop:"100px"}} className='cont_text0'>
                                <div><span>재고 상품 등록 및 관리</span></div>
                                <div><span>물품 등록 및 홍보는 다음 페이지이용</span></div>
                                <div style={{borderBottom:"4px solid black", borderRadius:"30px",width:"100px",marginTop:"10px"}}><span></span></div>
                            </div>
                            <div className='cont_text1' style={{marginLeft:"80px",marginTop:"130px"}}>
                                <span style={{ width:"400px",fontSize: "50px", fontWeight: "600", textAlign: "left", marginBottom: "10px" }}>재고 등록&수정</span>
                                <span>가게들의 재고 메뉴를 등록해보세요! 가게들의 재고 메뉴들을 한 번에 관리 하실 수 있습니다, 등록된 메뉴들의 정보를 입력해 홍보해보세요</span>
                                <span style={{ marginTop: "30px" }}><a style={{ borderBottom: "1px dashed black", cursor:"pointer" }} onClick={()=>{navigate("/owner_addmenu");}}>알아보기 {">"}</a></span>
                            </div>                                
                            <a style={{ marginLeft: "-430px", marginTop: "-450px", position: "absolute" }}><img style={{ width: "650px" , filter: "contrast(130%)"}} src='https://i.pinimg.com/564x/96/25/1c/96251c1125878e948918e151def81ca0.jpg'></img><div style={{ marginLeft: "250px", marginTop: "-500px", width: "800px", height: "550px", backgroundColor: "#f3eded" }}></div></a>
                        </div>
                    </div>
                    <div className='text'><span>공지사항</span></div>
                    <div className={`content3 ${temp1 == true ? "" : "contents_hidden"}`}>
                    <div style={{float:"right",marginRight:"30px"}}><button className='notice_btn' onClick={()=>{
                        navigate("/owner_notice");
                    }}>전체보기 <span style={{color:"#459522"}}> {'>'} </span></button></div>
                        <div className='content3all'>
                        {currentPosts.map((nti, index) => (
                            <div className='notice_main_content3' style={{width:"21%",height:"80%",border:"1px solid rgb(180,180,180)"}}>
                                <div key={index} style={{ height: "40px" }}>
                                    <div id="notice_row"><span style={{fontSize:"20px", fontWeight:"900",color:"#459522"}}><EventNoteIcon style={{marginBottom:"-3.5px",marginRight:"3px"}}></EventNoteIcon>공지</span></div>
                                    <div id="notice_row" onClick= {()=>{
                                        navigate(`/owner_noticeview/${nti.noticeIdx}`)
                                        axios.get('/manager/notice/read',{
                                            params: {
                                                noticeIdx:nti.noticeIdx,
                                                title:nti.title
                                            }
                                        })
                                        .then(response => {
                                            const not = response.data;
                                            const noticep = `?notititle=${not.title}&notiDate=${not.noticeDate}&noticontent=${not.content}`;
                                            const popupURL = `/owner_noticeview/${nti.noticeIdx}${noticep}`;
                                            navigate(popupURL);
                                        })
                                        .catch(error => {
                                            console.error('세션 데이터를 가져오는데 실패함', error);
                                        });
                                    }}><span style={{fontSize:"40px",fontWeight:"700px"}}>{nti.title}</span></div>
                                    <div id="notice_row_con"style={{minHeight:"150px"}}><span style={{fontSize:"18px",color:"rgb(160,160,160)"}}>{nti.content}</span></div>
                                    <div id="notice_row"><span style={{fontSize:"18px",color:"rgb(160,160,160)"}}><UpdateIcon style={{marginBottom:"-5px",marginRight:"3px"}}></UpdateIcon>{nti.noticeDate}</span></div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <footer id="footer" className={`${temp1 == true ? "" : "footer_hidden"}`} style={{
                    backgroundColor: 'white', // 헤더 배경색
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // 그림자 효과
                    zIndex: 1, // 다른 요소 위에 나타나도록 설정
                    borderRadius: "20px",
                    marginTop: "32px"
                }}>
                    <div className='footer1'><a href="/">재고 30</a></div>
                    <div className='footer2'>개인정보 및 보호정책 등</div>
                </footer>
                <div className={`${temp1 == true ? "popup_view_none" : "popup_view"}`} style={{ position: "fixed", top: "50%" }}>
                    <div>
                        <Avatar
                            src={Image}
                            style={{ margin: '20px' }}
                            size={150}
                            onClick={() => { fileInput.current.click() }} />
                        <div><a href='/' style={{ color: "gray", textDecorationLine: 'underline' }}>회원 정보 수정</a></div>
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
                        <a href="" ><span>예약 확인</span></a>
                    </div>
                    <div id="popsec3" style={{ cursor: "pointer" }}>
                        <a href=""> <span>내 신뢰점수</span></a>
                    </div>
                    <div id="popsec2" style={{ cursor: "pointer" }}>
                        <a href="owner"><span>가게 등록</span></a>
                    </div>
                    <button className="popup_btn" onClick={() => {
                        setTemp1(!temp1)
                    }}><a>[ CLOSE ]</a></button>

                </div>
            </div>
        </div>
    );
}
export default Owner_main_page;