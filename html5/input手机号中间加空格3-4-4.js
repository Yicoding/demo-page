import React, { useState, useEffect, useCallback, createRef } from "react";

import ls from '~/utils/ls';
import { Toast, InputItem, WhiteSpace, Button } from 'antd-mobile';
import { Page } from "@wonder-ui/core";
import { formatMobile, Mobile } from '~/utils/tools';
import { Content } from './input手机号中间加空格3-4-4-styles';

function splitPhone(val, showTxt = true) {
  val = val.toString().replace(/\s/g, '').slice(0, 11);
  if (!val && showTxt) {
    return '请输入手机号码';
  }
  if (val.length < 4) {
    return val;
  }
  if (val.length > 3 && val.length < 8) {
    return `${val.substring(0, 3)} ${val.substring(3)}`
  }
  if (val.length > 7) {
    return `${val.substring(0, 3)} ${val.substring(3, 7)} ${val.substring(7)}`
  }
}
// import PageContent from "~/components/PageContent";
import routing from "~/stores/routing";

let timee = null;
const duration = 50;
const ref = createRef();

export default function (props) {

  const { query } = props;
  const { fromHome } = query;

  const [loginId, setLoginId] = useState('');
  const [smsCode, setCode] = useState('');
  const [num, setNum] = useState(duration);
  const [loadSms, setLoadSms] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showLine, setShowLine] = useState(false);

  // init
  useEffect(() => {
    if (ls.get('accessToken')) { // 存在缓存，无需登录，回退到上一页
      routing.goBack();
    }
    return () => {
      clearInterval(timee);
      timee = null;
    }
  }, []);

  // 倒计时完成
  useEffect(() => {
    if (num === 0) {
      clearInterval(timee);
      timee = null;
      setLoadSms(false);
      setNum(duration);
      return;
    }
  }, [num]);

  // 按钮可点击
  useEffect(() => {
    if (formatMobile(loginId) && smsCode) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [loginId, smsCode])

  // 获取验证码
  const sendSms = useCallback(() => {
    if (!formatMobile(loginId)) { // 手机号格式错误
      return Toast.info('请输入正确的手机号码', 1.5);
    }
    setLoadSms(true);
    if (timee) {
      clearInterval(timee);
    }
    timee = setInterval(() => {
      setNum(val => val - 1);
    }, 1000);
  }, [loginId, num]);

  // 获取验证码按钮
  const extraBtn = useCallback(() => {
    if (loadSms) {
      return <span>重新获取{num}s</span>
    }
    return <div className="btn-sms" onClick={sendSms}>获取验证码</div>
  }, [loginId, loadSms, num]);

  // 手机号回调
  const loginIdHandle = useCallback((e) => {
    setLoginId(e.target.value);
  }, []);

  // 聚焦
  const onFocus = useCallback(() => {
    ref && ref.current.focus();
    setShowLine(true);
  }, []);

  // 失去焦点
  const onBlur = useCallback(() => {
    setShowLine(false);
  }, []);

  // 验证码回调
  const smsCodeHandle = useCallback((value) => {
    setCode(value);
  }, []);

  // 点击登录
  const goLogin = useCallback(() => {
    if (fromHome) { // 首页进来，跳转到立即申请页面
      return routing.push('/404');
    }
    routing.goBack();
  }, []);

  return (
    <Page name="登录" pageContent={false}>
      <Content>
        <WhiteSpace size="lg" />
        {/* <InputItem
          clear
          type="number"
          placeholder="请输入手机号码"
          maxLength={11}
          value={loginId}
          onChange={loginIdHandle}
        >手机号码</InputItem> */}
        <div className="mobile-box">
          <div className="mobile-item">
            <span className="mobile-label">手机号码</span>
            <div className="mobile-line">
              <input
                ref={ref}
                onBlur={onBlur}
                type="tel"
                maxLength="11"
                value={loginId}
                onChange={loginIdHandle}
                placeholder="请输入手机号码"
              />
              <span onClick={onFocus} className={loginId ? '' : 'gray'}>{splitPhone(loginId)}{showLine && <i className={loginId ? '' : 'site-l'} />}</span>
            </div>
          </div>
        </div>
        <InputItem
          maxLength={6}
          placeholder="请输入验证码"
          extra={extraBtn()}
          value={smsCode}
          onChange={smsCodeHandle}
        >验证码</InputItem>
        <div className="btn-login">
          <Button
            type="primary"
            size="large"
            disabled={disabled}
            onClick={goLogin}
          >登 录</Button>
        </div>
      </Content>
    </Page>
  );
};
