// global-style.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    @font-face {
      font-family: "DungGeunMo";
      src: url("/fonts/DungGeunMo.ttf");
    }
    html{
      margin: 0;
      padding: 0;
      background-color: #333333;
<<<<<<< HEAD
      width: 100vw;
      height: 90vh;
=======
      width: 90vw;
      height: 95vh;
>>>>>>> b0bd697a84067e765ab6e03479a065209faf7f34
    }
    body {
       /* 스크롤바 없에기 */
    -ms-overflow-style: none;
    height: 90vh;
    background-color: #fffff8;
    position: absolute;
    top: 50%;
    left: 50%;
<<<<<<< HEAD
=======
    width:30%;
>>>>>>> b0bd697a84067e765ab6e03479a065209faf7f34
    transform: translate(-50%,-50%);
    }

    @media (max-width: 1300px){
        //모바일
          html{
          margin: 0;
          padding: 0;
          background-color: white;
<<<<<<< HEAD
          width: 100vw;
          height: 100vh;
=======
          width: 90vw;
          height: 95vh;
>>>>>>> b0bd697a84067e765ab6e03479a065209faf7f34
        }

        body {
          /* 스크롤바 없에기 */
          margin:0;
          padding: 0;
          -ms-overflow-style: none;
          width: 100%;
          height: 100%;
          background-color: #fffff8;
        }         
    }
<<<<<<< HEAD

    @media (min-width: 768px) and (max-width: 991px) {
        // 테블릿 세로
    }

    @media (min-width: 992px) and (max-width: 1199px) {
        // 테블릿 가로
    }

    @media (min-width: 1200px) {
        // 데스크탑 일반
    }
=======
>>>>>>> b0bd697a84067e765ab6e03479a065209faf7f34
`;

export const colors = createGlobalStyle`
  
`;
