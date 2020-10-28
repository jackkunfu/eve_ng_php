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
	$scope.apiBase = 'http://i3gdtc.natappfree.cc';
	// $scope.apiBase = 'http://' + location.hostname + ':9000';
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
	$scope.stuCenter = [
		// { name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		// { name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		// { name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		// { name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		// { name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		// { name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		// { name: 'bjssbhpishvdvis', createTime: '2019-01-01' }
	]
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

	$scope.ziPages = []
	$scope.curZiP = 0

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
		0: {
			username: EVENEWUSERNAME, category: 'introduce', pageNum: $scope.curPage, pageSize: $scope.pSize
		},
		1: {
			username: EVENEWUSERNAME, category: 'useDesc', pageNum: $scope.curPage, pageSize: $scope.pSize
		},
		2: {
			username: EVENEWUSERNAME, pageNum: 0, pageSize: 1000
		},
		3: {
			username: EVENEWUSERNAME, pageSize: $scope.pSize
		},
		4: {
			username: EVENEWUSERNAME, pageNum: $scope.curPage, pageSize: $scope.pSize
		},
		5: {
			username: EVENEWUSERNAME, category: 'notify', pageNum: $scope.curPage, pageSize: $scope.pSize
		}
	}

	// $scope.listKey = { 0: 'platFormList', 2: 'courseList', 3: 'docList', 4: 'tongzhiList' }
	// $scope.listKey = { 0: 'platFormList', 2: 'labList', 3: 'docList', 4: 'tongzhiList' }
	$scope.listKey = { 0: 'platFormList', 1: 'useDescList', 2: 'labList', 3: 'stuCenter', 4: 'docList', 5: 'tongzhiList' }

	$scope.clickTab = function (idx, isPageClick) {
		if (!isPageClick) {
			if (idx == 0) {
				$scope.isShowPage = false
			} else {
				$scope.isShowPage = true
			}
			$scope.isShowTongzhiDtl = false
			// if ($scope.curNav == idx && $scope.curNav != 2) return
			// $scope.isShowStu = false
			$scope.curNav = idx
			$scope.curPage = 1

			// if (idx == 2) {
			// 	$location.path('/main')
			// 	return
			// }
		}

		// if (isPageClick) {
		// 	if ($scope.isShowStu) {
		// 		$scope.showCourse($scope.curCourse);
		// 		return
		// 	}
		// }

		var urlSplit = tabUrl[idx].split(',')
		var method = urlSplit[1] ? urlSplit[1].trim() : 'get'
		var obj = {
			method: method,
			url: $scope.apiBase + urlSplit[0]
		}
		
		if (method.toLocaleLowerCase() == 'get') {
			obj.params = tabOpts[idx]
			obj.params.pageNum = $scope.curPage
		} else {
			obj.data = tabOpts[idx]
			obj.data.pageNum = $scope.curPage
		}
		$http(obj).then(
			function successcallback(response) {
				if (response && response.data && response.data.data) {
					var res = response.data.data

					var list = Object.prototype.toString.call(res) == '[object Array]' ? res : res.list || []
					$scope[$scope.listKey[idx]] = list
					console.log($scope.listKey[idx], list);

					if (idx == 0) {
						$scope.platform.content = list[0].content
						$scope.platform.img = list[0].image
					}
					else if (idx == 1) $scope.clickLine(0) // 使用说明展示

					var total = res.total || 0
					var totolP = Math.floor(total / 15) + 1

					$('#page').bootstrapPaginator({
						currentPage: $scope.curPage,//当前的请求页面。
						totalPages: totolP,//一共多少页。
						size: "normal",//应该是页眉的大小。
						// bootstrapMajorVersion: 3,//bootstrap的版本要求。
				    alignment:"right",
				    // numberOfPages: 8,//一页列出多少数据。
				    itemTexts: function (type, page, current) {//如下的代码是将页眉显示的中文显示我们自定义的中文。
							switch (type) {
								case "first": return "首页";
								case "prev": return "上一页";
								case "next": return "下一页";
								case "last": return "末页";
								case "page": return page;
							}
						},
						onPageClicked: function (event, originalEvent, type, page) {
							console.log(page)
							$scope.curPage = page;
							$scope.clickTab($scope.curNav, true);
						}
					});
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
		location.href = '#main'
	}

	$scope.downItem = function (item) {
		window.open(item.url);
	}

	$scope.chooseCourse = function (item) {
		$scope.curPage = 1;
		if (item.directory) { // 请求子集目录
			$http({
				method: 'get',
				url: $scope.apiBase + '/api/lab/list',
				params: {
					pageSize: 15, pageNum: $scope.curPage, path: item.path, username: EVENEWUSERNAME
				}
			}).then(
				function successcallback(response) {
					if (response && response.data && response.data.data) {
						var res = response.data.data
						if (Object.prototype.toString.call(res) == '[object Array]') {
							$scope.labList = res
						} else {
							$scope.labList = res.list || []
						}

						var total = res.total || 0
						var totolP = Math.floor(total / 15) + 1
	
						$('#page').bootstrapPaginator({
							currentPage: $scope.curPage,//当前的请求页面。
							totalPages: totolP,//一共多少页。
							size: "normal",//应该是页眉的大小。
							// bootstrapMajorVersion: 3,//bootstrap的版本要求。
							alignment: "right",
							// numberOfPages: 8,//一页列出多少数据。
							itemTexts: function (type, page, current) {//如下的代码是将页眉显示的中文显示我们自定义的中文。
								switch (type) {
									case "first": return "首页";
									case "prev": return "上一页";
									case "next": return "下一页";
									case "last": return "末页";
									case "page": return page;
								}
							},
							onPageClicked: function (event, originalEvent, type, page) {
								console.log(page)
								$scope.curPage = page;
								$scope.clickTab($scope.curNav, true);
							}
						});
					}
				},
				function errorcallback(response) {
					console.log("unknown error. why did api doesn't respond?");
					// $location.path("/login");
				}
			)
			return
		}

		$scope.curCourse = item;
		$scope.isShowStu = true

		getStuList($scope.curCourse.path);
	}

	function getStuList (labId) {
		$http({
			method: 'get',
			url: $scope.apiBase + '/api/student/list',
			params: { username: EVENEWUSERNAME, pageNum: $scope.curPage, pageSize: 15, labId: labId }
		}).then(
			function successcallback(response) {
				if (response && response.data) {
					var res = response.data.data || {}
					$scope.stuCenter = res.list || []
					
					var total = res.total || 0
					var totolP = Math.floor(total / 15) + 1

					$('#page').bootstrapPaginator({
						currentPage: $scope.curPage,//当前的请求页面。
						totalPages: totolP,//一共多少页。
						size: "normal",//应该是页眉的大小。
						// bootstrapMajorVersion: 3,//bootstrap的版本要求。
						alignment: "right",
						// numberOfPages: 8,//一页列出多少数据。
						itemTexts: function (type, page, current) {//如下的代码是将页眉显示的中文显示我们自定义的中文。
							switch (type) {
								case "first": return "首页";
								case "prev": return "上一页";
								case "next": return "下一页";
								case "last": return "末页";
								case "page": return page;
							}
						},
						onPageClicked: function (event, originalEvent, type, page) {
							console.log(page)
							$scope.curPage = page;
							getStuList(labId)
						}
					});
				}
			},
			function errorcallback(response) {
				console.log("unknown error. why did api doesn't respond?");
			}
		)
	}

	$scope.showTongzhi = function (item) {
		$scope.curTongzhi = item
		$scope.isShowTongzhiDtl = true
	}
	$scope.showCourse = function (item) {
		$scope.curCourse = item
		$scope.isShowCourseDtl = true
		$http({
			method: 'get',
			url: $scope.apiBase + '/api/student/list',
			params: { username: EVENEWUSERNAME, pageNum: $scope.curPage, pageSize: 1000 }
		}).then(
			function successcallback(response) {
				if (response && response.data) {
					$scope.stuCenter = response.data.data || []
					// console.log($scope.stuCenter)
				}
			},
			function errorcallback(response) {
				console.log("unknown error. why did api doesn't respond?");
			}
		)
	}

	$scope.downExcel = function (url) {
		location.href = url
	}
}