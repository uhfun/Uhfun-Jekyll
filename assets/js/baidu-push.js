(function() {
	var canonicalURL, curProtocol;
	var x = document.getElementsByTagName("link");
	if (x.length > 0) {
		for (i = 0; i < x.length; i++) {
			if (x[i].rel.toLowerCase() == 'canonical' && x[i].href) {
				canonicalURL = x[i].href;
			}
		}
	}
	if (!canonicalURL) {
		curProtocol = window.location.protocol.split(':')[0];
	} else {
		curProtocol = canonicalURL.split(':')[0];
	}
	if (!canonicalURL) canonicalURL = window.location.href;
	!
	function() {
		var e = /([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi,
			r = canonicalURL,
			t = document.referrer;
		if (!e.test(r)) {
			var n = (String(curProtocol).toLowerCase() === 'https') ? "https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif" : "//api.share.baidu.com/s.gif";
			t ? (n += "?r=" + encodeURIComponent(document.referrer), r && (n += "&l=" + r)) : r && (n += "?l=" + r);
			var i = new Image;
			i.src = n
		}
	}(window);
})();