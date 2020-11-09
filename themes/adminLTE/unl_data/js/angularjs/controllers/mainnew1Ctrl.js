function getPoint(obj) { //获取某元素以浏览器左上角为原点的坐标
	var t = obj.offsetTop; //获取该元素对应父容器的上边距
	var l = obj.offsetLeft; //对应父容器的上边距
	//判断是否有父容器，如果存在则累加其边距
	while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
		t += obj.offsetTop; //叠加父容器的上边距
		l += obj.offsetLeft; //叠加父容器的左边距
	}
	return { t: t, l: l }
}
function hdlPages (cur, total) {
	var arr = []
	if (total < 11) { // 不需要展示省略号
		var i = 1
		while (i <= total) {
			arr.push(i)
			i++
		}
		return arr
	}

	// 需要展示省略号 目标 [1,'...', cur - 2, cur - 1, cur, cur + 1, cur + 2, '...', total]

	var i = 1
	if (cur < 5) {
		var i = 1
		while (i <= cur + 2) {
			arr.push(i)
			i++
		}
		return arr.concat(['...', total])
	} else if (cur > total - 4) {
		var i = cur - 2
		while (i <= total) {
			arr.push(i)
			i++
		}
		return [1,'...'].concat(arr)
	} else { // 拼接省略号之后
		return [1,'...', cur - 2, cur - 1, cur, cur + 1, cur + 2, '...', total]
	}
}
function mainnew1Controller($scope, $http, $location, $window, $uibModal, $log, $rootScope, FileUploader, focus) {
	console.log('mainnew11')
	$.unblockUI();
	$rootScope.openLaba=false;
	// $scope.testAUTH("/main"); //TEST AUTH
	//Default variables ///START
	console.log('Current user position: '+$rootScope.folder)
	$scope.path= ($rootScope.folder === undefined || $rootScope.folder == '') ? '/' :  $rootScope.folder;
	$scope.newElementName='';
	$scope.newElementToggle=false;
	$scope.fileSelected=false;
	$scope.allCheckedFlag=false;
	$scope.blockButtons=false;
	$scope.blockButtonsClass='';
	$scope.fileManagerItem=[];
	$scope.checkboxArray=[];
	$scope.isShowStu = false
	$scope.isShowPage = true

	$scope.platform = {
		content: '', img: ''
	}
	
	//Default variables ///END
	// $scope.apiBase = 'http://a26bgz.natappfree.cc';
	$scope.apiBase = 'http://' + location.hostname + ':9000';
	$scope.navList = [
		{ name: '平台介绍', hf: 'nav1' },
		{ name: '使用说明', hf: 'nav2' },
		{ name: '学生中心', hf: 'nav3' },
		{ name: '资料下载', hf: 'nav4' },
		{ name: '通知中心', hf: 'nav5' }
	]
	$scope.platformList = []
	$scope.useDescList = []
	$scope.labList = []
	$scope.courseList = [
		{ name: 'CCNA', id: 1 },
		{ name: 'CCNP ROUTER', id: 1 },
		{ name: 'CCNP SWITCH', id: 1 },
		{ name: 'TEST 1', id: 1 }
	]
	$scope.stuCenter = []
	$scope.messageList = []
	$scope.docList = []
	$scope.tongzhiList = []
	
	$scope.curNav = 0
	$scope.isShowCourseDtl = false // 展示课程详情
	$scope.isShowTongzhiDtl = false // 展示通知详情
	$scope.curTongzhi = {}
	$scope.curCourse = {}
	$scope.curLabId = null

	var EVENEWUSERNAME = localStorage.EVENEWUSERNAME || ''
	if (!EVENEWUSERNAME) {
		$location.path("/login");
	}

	$scope.lineBtnIdx = -1
	$scope.showUseDescList = []
	$scope.lineBtnNum = $scope.useDescList.length ? Math.ceil(scope.useDescList.length / 4) : 0 // linebtn的个数
	$scope.clickLine = function (idx) {
		if ($scope.lineBtnIdx == idx) return
		$scope.lineBtnIdx = idx
		$scope.showUseDescList = $scope.useDescList.slice(4 * idx, 4 * idx + 3)
		console.log('showUseDescList',$scope.showUseDescList);
	}
	$scope.seeDtl = function (item) {
		// console.log(item);
		location.href = '#/detail?id=' + item.id;
	}

	var tabUrl = {
		0: '/api/article/list',
		1: '/api/article/list',
		2: '/api/lab/list', // '/api/lab/list'
		3: '/api/student/list', // '/api/lab/list'
		4: '/api/file/list',
		5: '/api/article/list'
	}

	$scope.curPage = 1
	$scope.pSize = 15

	var tabOpts = {
		0: { username: EVENEWUSERNAME, category: 'introduce' },
		1: { username: EVENEWUSERNAME, category: 'useDesc' },
		2: { username: EVENEWUSERNAME, pageSize: 1000 },
		3: { username: EVENEWUSERNAME },
		4: { username: EVENEWUSERNAME },
		5: { username: EVENEWUSERNAME, category: 'notify' }
	}

	$scope.pageOpt = {
		0: { cur: 1, size: 20, total: 0 },
		1: { cur: 1, size: 4, total: 0 },
		2: { cur: 1, size: 1000, total: 0 }, // 配置1000size相当于全量获取
		3: { cur: 1, size: 20, total: 0 },
		4: { cur: 1, size: 20, total: 0 },
		5: { cur: 1, size: 20, total: 0 }
	}

	$scope.pageArr0 = []
	$scope.pageArr1 = []
	$scope.pageArr2 = []
	$scope.pageArr3 = []
	$scope.pageArr4 = []
	$scope.pageArr5 = []

	$scope.listKey = { 0: 'platFormList', 1: 'useDescList', 2: 'labList', 3: 'stuCenter', 4: 'docList', 5: 'tongzhiList' }

	$scope.clickPage = function (idx, page) {
		if (page === 'pre') {
			$scope.pageOpt[idx].cur--
		} else if (page === 'next') {
			$scope.pageOpt[idx].cur++
		} else if (page !== '...') {
			$scope.pageOpt[idx].cur = page
		}

		$scope.clickTab(idx)
	}

	$scope.clickTab = function (idx) {
		var urlSplit = tabUrl[idx].split(',')
		var method = urlSplit[1] ? urlSplit[1].trim() : 'get'
		var obj = {
			method: method,
			url: $scope.apiBase + urlSplit[0]
		}

		var idxPage = $scope.pageOpt[idx].cur
		var idxSize = $scope.pageOpt[idx].size // 实验不做分页 传递1000全量获取
		if (method.toLocaleLowerCase() == 'get') {
			obj.params = tabOpts[idx]
			obj.params.pageNum = idxPage
			obj.params.pageSize = idxSize
		} else {
			obj.data = tabOpts[idx]
			obj.data.pageNum = idxPage
			obj.data.pageSize = idxSize
		}

		$http(obj).then(
			function successcallback(response) {
				if (response && response.data && response.data.data) {
					var res = response.data.data

					var list = Object.prototype.toString.call(res) == '[object Array]' ? res : res.list || []
					$scope[$scope.listKey[idx]] = list
					// console.log($scope.listKey[idx], list);

					if (idx == 0) {
						$scope.platform.content = list[0].content
						$scope.platform.img = list[0].image
					} else if (idx == 3 && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							list[i].lab = (list[i].lab || '').replace(/\/opt\/unetlab\/labs\//, '')
						}
						$scope[$scope.listKey[idx]] = list
					}
					// else if (idx == 1) $scope.clickLine(0) // 使用说明展示

					var total = res.total || 0
					var totalP = total % idxSize > 0 ? Math.floor(total / idxSize) + 1 : total / idxSize // 总页码

					$scope.pageOpt[idx].total = totalP
					$scope['pageArr' + idx] = hdlPages(idxPage, totalP)
				}
			},
			function errorcallback(response) {
				console.log("unknown error. why did api doesn't respond?");
				// $location.path("/login");
			}
		)
	}

	$scope.clickTab(0);
	$scope.clickTab(1);
	$scope.clickTab(2); // 实验列表
	$scope.clickTab(3); // 学生列表
	$scope.clickTab(4);
	$scope.clickTab(5);

	$scope.navClick = function (item, idx) {
		$scope.curNav = idx
		var p = getPoint(document.getElementById(item.hf))
		// console.log(item.hf, p.t, p.l);
		window.scrollTo(p.l, p.t)
	}

	$scope.goMain = function () {
		location.href = '#/main'
	}

	$scope.downExcel = function (url) {
		window.open(url)
	}
}