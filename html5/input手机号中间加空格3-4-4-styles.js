import styled from 'styled-components';

export const Content = styled.div`
  .am-list-line {
    &:after {
      display: none !important;
    }
  }
  .mobile-box {
    color: #000;
    font-size: 17px;
    padding-left: 15px;
    background: #fff;
    .mobile-item {
      height: 44px;
      display: flex;
      align-items: center;
      padding-right: 15px;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: #ddd;
        transform: scaleY(0.5);
      }
      .mobile-label {
        width: 85px;
        margin-right: 5px;
      }
      .mobile-line {
        flex: 1;
        position: relative;
        input {
          padding: 0;
          border: 0;
          background:none;
          outline:none;
          margin-left: -100%; // 隐藏input光标
        }
        span {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 9;
          background: #fff;
          &.gray {
            color: #bcbcbc;
          }
          i {
            display: inline-block;
            width: 2px;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            border-radius: 4px;
            background: #5A7AF0;
            animation: lightline 1s linear 1s infinite;
            &.site-l {
              right: initial;
              left: 0;
            }
          }
        }
      }
    }
  }
  .btn-sms {
    color: #333;
  }
  .btn-login {
    padding: 25px 15px 0;
  }
  @keyframes lightline {
    0% {
      opacity: 0;
    }
    35%{
      opacity: 1;
    }
    65%{
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;