function mainnew1Controller($scope, $http, $location, $window, $uibModal, $log, $rootScope, FileUploader, focus) {
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
	
	//Default variables ///END
	$scope.apiBase = 'http://10.1.125.130:9000';
	$scope.navList = [
		{ name: '平台介绍' },
		{ name: '使用说明' },
		// { name: '实验项目' },
		{ name: '学生中心' },
		{ name: '资料下载' },
		{ name: '通知中心' }
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
	
	$scope.curNav = -1
	$scope.isShowCourseDtl = false // 展示课程详情
	$scope.isShowTongzhiDtl = false // 展示通知详情
	$scope.curTongzhi = {}
	$scope.curCourse = {}
	$scope.curLabId = null

	var EVENEWUSERNAME = localStorage.EVENEWUSERNAME || ''
	if (!EVENEWUSERNAME) {
		$location.path("/login");
	}

	var tabUrl = {
		0: '/api/article/list',
		1: '/api/article/list',
		3: '/api/student/list', // '/api/lab/list'
		// 2: '/api/lab/list', // '/api/lab/list'
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
	$scope.listKey = { 0: 'platFormList', 1: 'useDescList', 3: 'stuCenter', 4: 'docList', 5: 'tongzhiList' }

	$scope.clickTab = function (item, idx, isPageClick) {
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

			if (idx == 2) {
				$location.path('/main')
				return
			}
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
			url: $scope.apiBase + urlSplit[0],
			pageNum: $scope.curPage
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
					if (Object.prototype.toString.call(res) == '[object Array]') {
						$scope[$scope.listKey[idx]] = res
					} else {
						$scope[$scope.listKey[idx]] = res.list || []
					}

					let total = res.total || 0
					let totolP = Math.floor(total / 15) + 1

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
							$scope.clickTab({}, $scope.curNav, true);
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

	// $scope.clickTab({}, 4);
	$scope.clickTab({}, 0);

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

						let total = res.total || 0
						let totolP = Math.floor(total / 15) + 1
	
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
								$scope.clickTab({}, $scope.curNav, true);
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
					
					let total = res.total || 0
					let totolP = Math.floor(total / 15) + 1

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
	$scope.showCourseList = function () {
		$scope.isShowStu = false
		$scope.curCourse = {}
	}
	$scope.showTongzhiList = function () {
		$scope.isShowTongzhiDtl = false
		$scope.curTongzhi = {}
	}


	// $http.get('/api/labs/CCNA/configs/' + id)
	// 	.then(
	// 		function successCallback(response){
	// 			$("#nodeconfig").val(response.data.data.data)
	// 		},
	// 		function errorCallback(response){
	// 			console.log('Server Error');
	// 			console.log(response);
	// 		}
	// 	)
}