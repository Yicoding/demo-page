// h5分享
function RequestURL(QueryString) {
	var strHref = window.location.href;
	var strParm = "";
	if (strHref.search(/\?/) != -1) {
	  strHref = strHref.substr(strHref.search(/\?/) + 1);
	  strHref = strHref.split(/&/);
	  for (var icount = 0; icount < strHref.length; icount++) {
		if (strHref[icount].search("^" + QueryString + "=") != -1) {
		  strParm = strHref[icount].substr(QueryString.length + 1);
		}
	  }
	  return (strParm);
	}
	return (strParm);
}
var ad_id = RequestURL("ad_id");

emH5.Share({
	title: "标题",
	desc: "描述",
	link: window.location.origin + "/Html/aghd/native/6/20180612/html/share.html?ad_id=" + ad_id,
	imgUrl: window.location.origin + "/Html/aghd/native/6/20180612/resource/img/share.png",
	app: true
});