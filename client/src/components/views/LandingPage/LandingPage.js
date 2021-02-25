import React, { useEffect } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {

    useEffect(() => {

    }, []);


    
    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
            .then(response => {
                if (response.data.success) {
                    props.history.push("/login");
                } else {
                    alert('로그아웃 하는데 실패 했습니다.');
                }
            });
    }

    const goLoginPage = () => {
        props.history.push("/login");
    }

    const goRegisterPage = () => {
        props.history.push("/register");
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
            <h2 style={{margin: '10px'}}>시작 페이지</h2>

            <button onClick={goLoginPage}>
                로그인
            </button>
            <button style={{margin: '10px'}} onClick={goRegisterPage}>
                회원가입
            </button>
            <button onClick={onClickHandler}>
                로그아웃
            </button>

        </div>
    );
}

export default withRouter(LandingPage);