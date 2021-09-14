function getPoint(obj) {
  //获取某元素以浏览器左上角为原点的坐标
  var t = obj.offsetTop; //获取该元素对应父容器的上边距
  var l = obj.offsetLeft; //对应父容器的上边距
  //判断是否有父容器，如果存在则累加其边距
  while ((obj = obj.offsetParent)) {
    //等效 obj = obj.offsetParent;while (obj != undefined)
    t += obj.offsetTop; //叠加父容器的上边距
    l += obj.offsetLeft; //叠加父容器的左边距
  }
  return { t: t, l: l };
}
function hdlPages(cur, total) {
  var arr = [];
  if (total < 11) {
    // 不需要展示省略号
    var i = 1;
    while (i <= total) {
      arr.push(i);
      i++;
    }
    return arr;
  }

  // 需要展示省略号 目标 [1,'...', cur - 2, cur - 1, cur, cur + 1, cur + 2, '...', total]

  var i = 1;
  if (cur < 5) {
    var i = 1;
    while (i <= cur + 2) {
      arr.push(i);
      i++;
    }
    return arr.concat(['...', total]);
  } else if (cur > total - 4) {
    var i = cur - 2;
    while (i <= total) {
      arr.push(i);
      i++;
    }
    return [1, '...'].concat(arr);
  } else {
    // 拼接省略号之后
    return [1, '...', cur - 2, cur - 1, cur, cur + 1, cur + 2, '...', total];
  }
}

/* download.js */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.download = factory();
  }
})(this, function () {
  return function download(data, strFileName, strMimeType) {
    var self = window, // this script is only for browsers anyway...
      defaultMime = 'application/octet-stream', // this default mime also triggers iframe downloads
      mimeType = strMimeType || defaultMime,
      payload = data,
      url = !strFileName && !strMimeType && payload,
      anchor = document.createElement('a'),
      toString = function (a) {
        return String(a);
      },
      myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString,
      fileName = strFileName || 'download',
      blob,
      reader;
    myBlob = myBlob.call ? myBlob.bind(self) : Blob;

    if (String(this) === 'true') {
      //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
      payload = [payload, mimeType];
      mimeType = payload[0];
      payload = payload[1];
    }

    if (url && url.length < 2048) {
      // if no filename and no mime, assume a url was passed as the only argument
      fileName = url.split('/').pop().split('?')[0];
      anchor.href = url; // assign href prop to temp anchor
      if (anchor.href.indexOf(url) !== -1) {
        // if the browser determines that it's a potentially valid url path:
        var ajax = new XMLHttpRequest();
        ajax.open('GET', url, true);
        ajax.responseType = 'blob';
        ajax.onload = function (e) {
          download(e.target.response, fileName, defaultMime);
        };
        setTimeout(function () {
          ajax.send();
        }, 0); // allows setting custom ajax headers using the return:
        return ajax;
      } // end if valid url?
    } // end if url?

    //go ahead and download dataURLs right away
    if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)) {
      if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
        payload = dataUrlToBlob(payload);
        mimeType = payload.type || defaultMime;
      } else {
        return navigator.msSaveBlob // IE10 can't do a[download], only Blobs:
          ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
          : saver(payload); // everyone else can save dataURLs un-processed
      }
    } else {
      //not data url, is it a string with special needs?
      if (/([\x80-\xff])/.test(payload)) {
        var i = 0,
          tempUiArr = new Uint8Array(payload.length),
          mx = tempUiArr.length;
        for (i; i < mx; ++i) tempUiArr[i] = payload.charCodeAt(i);
        payload = new myBlob([tempUiArr], { type: mimeType });
      }
    }
    blob = payload instanceof myBlob ? payload : new myBlob([payload], { type: mimeType });

    function dataUrlToBlob(strUrl) {
      var parts = strUrl.split(/[:;,]/),
        type = parts[1],
        indexDecoder = strUrl.indexOf('charset') > 0 ? 3 : 2,
        decoder = parts[indexDecoder] == 'base64' ? atob : decodeURIComponent,
        binData = decoder(parts.pop()),
        mx = binData.length,
        i = 0,
        uiArr = new Uint8Array(mx);

      for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

      return new myBlob([uiArr], { type: type });
    }

    function saver(url, winMode) {
      if ('download' in anchor) {
        //html5 A[download]
        anchor.href = url;
        anchor.setAttribute('download', fileName);
        anchor.className = 'download-js-link';
        anchor.innerHTML = 'downloading...';
        anchor.style.display = 'none';
        anchor.addEventListener('click', function (e) {
          e.stopPropagation();
          this.removeEventListener('click', arguments.callee);
        });
        document.body.appendChild(anchor);
        setTimeout(function () {
          anchor.click();
          document.body.removeChild(anchor);
          if (winMode === true) {
            setTimeout(function () {
              self.URL.revokeObjectURL(anchor.href);
            }, 250);
          }
        }, 66);
        return true;
      }

      // handle non-a[download] safari as best we can:
      if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
        if (/^data:/.test(url)) url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        if (!window.open(url)) {
          // popup blocked, offer direct download:
          if (
            confirm('Displaying New Document\n\nUse Save As... to download, then click back to return to this page.')
          ) {
            location.href = url;
          }
        }
        return true;
      }

      //do iframe dataURL download (old ch+FF):
      var f = document.createElement('iframe');
      document.body.appendChild(f);

      if (!winMode && /^data:/.test(url)) {
        // force a mime that will download:
        url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
      }
      f.src = url;
      setTimeout(function () {
        document.body.removeChild(f);
      }, 333);
    } //end saver

    if (navigator.msSaveBlob) {
      // IE10+ : (has Blob, but not a[download] or URL)
      return navigator.msSaveBlob(blob, fileName);
    }

    if (self.URL) {
      // simple fast and modern way using Blob and URL:
      saver(self.URL.createObjectURL(blob), true);
    } else {
      // handle non-Blob()+non-URL browsers:
      if (typeof blob === 'string' || blob.constructor === toString) {
        try {
          return saver('data:' + mimeType + ';base64,' + self.btoa(blob));
        } catch (y) {
          return saver('data:' + mimeType + ',' + encodeURIComponent(blob));
        }
      }

      // Blob but not URL support:
      reader = new FileReader();
      reader.onload = function (e) {
        saver(this.result);
      };
      reader.readAsDataURL(blob);
    }
    return true;
  };
});
/* end download() */

function mainnew1Controller($scope, $http, $location, $window, $uibModal, $log, $rootScope, FileUploader, focus) {
  console.log('mainnew11');
  $.unblockUI();
  $rootScope.openLaba = false;
  // $scope.testAUTH("/main"); //TEST AUTH
  //Default variables ///START
  console.log('Current user position: ' + $rootScope.folder);
  $scope.path = $rootScope.folder === undefined || $rootScope.folder == '' ? '/' : $rootScope.folder;
  $scope.newElementName = '';
  $scope.newElementToggle = false;
  $scope.fileSelected = false;
  $scope.allCheckedFlag = false;
  $scope.blockButtons = false;
  $scope.blockButtonsClass = '';
  $scope.fileManagerItem = [];
  $scope.checkboxArray = [];
  $scope.isShowStu = false;
  $scope.isShowPage = true;

  $scope.platform = {
    content: '',
    img: ''
  };

  //Default variables ///END
  // $scope.apiBase = 'http://a26bgz.natappfree.cc';
  $scope.apiBase = 'http://' + location.hostname + ':9000';
  $scope.navList = [
    { name: '平台介绍', hf: 'nav1' },
    { name: '实验预习', hf: 'nav2' },
    { name: '常见问题', hf: 'nav22' },
    { name: '学生中心', hf: 'nav3' },
    { name: '资料下载', hf: 'nav4' },
    { name: '通知中心', hf: 'nav5' }
  ];
  $scope.platformList = [];
  $scope.useDescList = [];
  $scope.quesList = [];
  $scope.labList = [];
  $scope.courseList = [
    { name: 'CCNA', id: 1 },
    { name: 'CCNP ROUTER', id: 1 },
    { name: 'CCNP SWITCH', id: 1 },
    { name: 'TEST 1', id: 1 }
  ];
  $scope.stuCenter = [];
  $scope.messageList = [];
  $scope.docList = [];
  $scope.tongzhiList = [];

  $scope.curNav = 0;
  $scope.isShowCourseDtl = false; // 展示课程详情
  $scope.isShowTongzhiDtl = false; // 展示通知详情
  $scope.curTongzhi = {};
  $scope.curCourse = {};
  $scope.curLabId = null;

  var EVENEWUSERNAME = localStorage.EVENEWUSERNAME || '';
  if (!EVENEWUSERNAME) {
    $location.path('/login');
  }

  $scope.lineBtnIdx = -1;
  $scope.showUseDescList = [];
  $scope.lineBtnNum = $scope.useDescList.length ? Math.ceil(scope.useDescList.length / 4) : 0; // linebtn的个数
  $scope.clickLine = function (idx) {
    if ($scope.lineBtnIdx == idx) return;
    $scope.lineBtnIdx = idx;
    $scope.showUseDescList = $scope.useDescList.slice(4 * idx, 4 * idx + 3);
    console.log('showUseDescList', $scope.showUseDescList);
  };
  $scope.seeDtl = function (item, pstr) {
    // console.log(item);
    window.open(location.origin + '/#/detail?id=' + item.id + '&pstr=' + pstr);
    // location.href = '#/detail?id=' + item.id;
  };

  var tabUrl = {
    0: '/api/article/list',
    1: '/api/article/list',
    2: '/api/lab/list', // '/api/lab/list'
    3: '/api/student/list', // '/api/lab/list'
    4: '/api/file/list',
    5: '/api/article/list',
    6: '/api/article/list'
  };

  $scope.curPage = 1;
  $scope.pSize = 15;

  var tabOpts = {
    0: { username: EVENEWUSERNAME, category: 'introduce' },
    1: { username: EVENEWUSERNAME, category: 'useDesc' },
    2: { username: EVENEWUSERNAME, pageSize: 1000 },
    3: { username: EVENEWUSERNAME },
    4: { username: EVENEWUSERNAME },
    5: { username: EVENEWUSERNAME, category: 'notify' },
    6: { username: EVENEWUSERNAME, category: 'question' }
  };

  $scope.pageOpt = {
    0: { cur: 1, size: 20, total: 0 },
    1: { cur: 1, size: 4, total: 0 },
    2: { cur: 1, size: 1000, total: 0 }, // 配置1000size相当于全量获取
    3: { cur: 1, size: 20, total: 0 },
    4: { cur: 1, size: 15, total: 0 },
    5: { cur: 1, size: 20, total: 0 },
    6: { cur: 1, size: 4, total: 0 }
  };

  $scope.pageArr0 = [];
  $scope.pageArr1 = [];
  $scope.pageArr2 = [];
  $scope.pageArr3 = [];
  $scope.pageArr4 = [];
  $scope.pageArr5 = [];
  $scope.pageArr6 = [];

  $scope.listKey = {
    0: 'platFormList',
    1: 'useDescList',
    2: 'labList',
    3: 'stuCenter',
    4: 'docList',
    5: 'tongzhiList',
    6: 'quesList'
  };

  $scope.clickPage = function (idx, page) {
    if (page === 'pre') {
      $scope.pageOpt[idx].cur--;
    } else if (page === 'next') {
      $scope.pageOpt[idx].cur++;
    } else if (page !== '...') {
      $scope.pageOpt[idx].cur = page;
    }

    $scope.clickTab(idx);
  };

  $scope.clickTab = function (idx) {
    var urlSplit = tabUrl[idx].split(',');
    var method = urlSplit[1] ? urlSplit[1].trim() : 'get';
    var obj = {
      method: method,
      url: $scope.apiBase + urlSplit[0]
    };

    var idxPage = $scope.pageOpt[idx].cur;
    var idxSize = $scope.pageOpt[idx].size; // 实验不做分页 传递1000全量获取
    if (method.toLocaleLowerCase() == 'get') {
      obj.params = tabOpts[idx];
      obj.params.pageNum = idxPage;
      obj.params.pageSize = idxSize;
    } else {
      obj.data = tabOpts[idx];
      obj.data.pageNum = idxPage;
      obj.data.pageSize = idxSize;
    }

    $http(obj).then(
      function successcallback(response) {
        if (response && response.data && response.data.data) {
          var res = response.data.data;

          var list = Object.prototype.toString.call(res) == '[object Array]' ? res : res.list || [];
          $scope[$scope.listKey[idx]] = list;
          // console.log($scope.listKey[idx], list);

          if (idx == 0) {
            $scope.platform.content = list[0].content;
            $scope.platform.img = list[0].image;
          } else if (idx == 3 && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              list[i].lab = (list[i].lab || '').replace(/\/opt\/unetlab\/labs\//, '');
            }
            $scope[$scope.listKey[idx]] = list;
          }
          // else if (idx == 1) $scope.clickLine(0) // 使用说明展示

          var total = res.total || 0;
          var totalP = total % idxSize > 0 ? Math.floor(total / idxSize) + 1 : total / idxSize; // 总页码

          $scope.pageOpt[idx].total = totalP;
          $scope['pageArr' + idx] = hdlPages(idxPage, totalP);
        }
      },
      function errorcallback(response) {
        console.log("unknown error. why did api doesn't respond?");
        // $location.path("/login");
      }
    );
  };

  $scope.clickTab(0);
  $scope.clickTab(1);
  $scope.clickTab(2); // 实验列表
  $scope.clickTab(3); // 学生列表
  $scope.clickTab(4);
  $scope.clickTab(5);

  $scope.navClick = function (item, idx) {
    $scope.curNav = idx;
    var p = getPoint(document.getElementById(item.hf));
    // console.log(item.hf, p.t, p.l);
    window.scrollTo(p.l, p.t);
  };

  $scope.goMain = function () {
    location.href = '#/main';
  };

  $scope.downExcel = function (url, name) {
    download(url);
    return;
    // window.open(url);
    // location.href = url;
    let a = document.createElement('a');
    a.download = name; //设置下载的文件名
    a.href = url; // 设置图片的下载地址
    a.click(); //触发下载事件
  };
}
