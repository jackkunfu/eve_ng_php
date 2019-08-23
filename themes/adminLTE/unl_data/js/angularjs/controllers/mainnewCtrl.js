function mainnewController($scope, $http, $location, $window, $uibModal, $log, $rootScope, FileUploader, focus) {
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
	//Default variables ///END
	$scope.apiBase = 'http://47.99.201.236:9000'
	$scope.navList = [
		{ name: '平台介绍' },
		{ name: '实验项目' },
		{ name: '学生中心' },
		{ name: '资料下载' },
		{ name: '通知中心' }
	]
	$scope.platformList = []
	$scope.courseList = [
		{ name: 'CCNA', id: 1 },
		{ name: 'CCNP ROUTER', id: 1 },
		{ name: 'CCNP SWITCH', id: 1 },
		{ name: 'TEST 1', id: 1 }
	]
	$scope.stuCenter = [
		{ name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		{ name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		{ name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		{ name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		{ name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		{ name: 'bjssbhpishvdvis', createTime: '2019-01-01' },
		{ name: 'bjssbhpishvdvis', createTime: '2019-01-01' }
	]
	$scope.messageList = []
	$scope.docList = []
	$scope.tongzhiList = []
	
	$scope.curNav = -1
	$scope.isShowCourseDtl = false // 展示课程详情
	$scope.isShowTongzhiDtl = false // 展示通知详情
	$scope.curTongzhi = {}
	$scope.curCourse = {}

	var EVENEWUSERNAME = localStorage.EVENEWUSERNAME || ''
	if (!EVENEWUSERNAME) {
		$location.path("/login");
	}

	var tabUrl = {
		0: '/api/article/list',
		2: '/api/lab/list',
		3: '/api/file/list',
		4: '/api/article/list'
	}

	var tabOpts = {
		0: {
			username: EVENEWUSERNAME,
			category: 'introduce',
			pageNum: 1, pageSize: 10
		},
		2: {
			username: EVENEWUSERNAME,
			path: '/opt/unetlab/labs'
			// path: '/'
		},
		3: {
			username: EVENEWUSERNAME,
			pageNum: 1, pageSize: 10
		},
		4: {
			username: EVENEWUSERNAME,
			category: 'notify',
			pageNum: 1, pageSize: 10
		}
	}

	$scope.listKey = {
		0: 'platFormList', 2: 'courseList', 3: 'docList', 4: 'tongzhiList'
	}

	$scope.clickTab = function (item, idx) {
		$scope.isShowCourseDtl = false
		$scope.isShowTongzhiDtl = false
		if ($scope.curNav == idx) return
		$scope.curNav = idx

		if (idx == 1) {
			$location.path('/main')
			return
		}

		var urlSplit = tabUrl[idx].split(',')
		var method = urlSplit[1] ? urlSplit[1].trim() : 'get'
		var obj = {
			method: method,
			url: $scope.apiBase + urlSplit[0]
		}
		if (method.toLocaleLowerCase() == 'get') obj.params = tabOpts[idx]
		else obj.data = tabOpts[idx]
		$http(obj).then(
			function successcallback(response) {
				if (response && response.data && response.data.data) {
					var res = response.data.data
					if (Object.prototype.toString.call(res) == '[object Array]') {
						$scope[$scope.listKey[idx]] = res
					} else {
						$scope[$scope.listKey[idx]] = res.list || []
					}
				}
			},
			function errorcallback(response) {
				console.log("unknown error. why did api doesn't respond?");
				// $location.path("/login");
			}
		)
	}

	$scope.clickTab({}, 0)
	$scope.clickTab({}, 4)

	$scope.showTongzhi = function (item) {
		$scope.curTongzhi = item
		$scope.isShowTongzhiDtl = true
	}
	$scope.showCourse = function (item) {
		$scope.curCourse = item
		$scope.isShowCourseDtl = true
		// 获取实验指导书
		$http({
			method: 'get',
			url: $scope.apiBase + '/api/labGuide/get',
			params: { labId: item.path }
		}).then(
			function successcallback(response) {
				if (response && response.data && response.data.data) {
				
				}
			},
			function errorcallback(response) {
				console.log("unknown error. why did api doesn't respond?");
			}
		)
	}
	$scope.showCourseList = function () {
		$scope.isShowCourseDtl = false
		$scope.curCourse = {}
	}
	$scope.showTongzhiList = function () {
		$scope.isShowTongzhiDtl = false
		$scope.curTongzhi = {}
	}
}