// 生成海报
const generatePoster = useCallback(async () => {
  const { orgId, userId } = ls.get('user');
  // return console.log('user', user);
  Toast.loading('海报生成中...', 0);
  const baseUrl = 'https://www.99bill.com/seashell/webapp/x-project/invite-agent/#/invite?q=';
  const jsonData = {
    orgId, //代理商ID
    salesId: userId, //业务员ID
    qrcodeLevel: feeCodeList[fee], //费率
  };
  console.log('jsonData', jsonData);
  //转换参数为base64字符串
  const base64String = encodeURIComponent(window.btoa(JSON.stringify(jsonData)));

  //输出链接
  const qrCodeURL = baseUrl + base64String;
  const res = await createShareImage({ qrText: qrCodeURL });
  setImgUrl(res);
  console.log('res', res);
  Toast.hide();
}, []);