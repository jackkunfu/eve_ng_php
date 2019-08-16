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

	$scope.messageList = []
	$scope.navList = [
		{ name: '平台介绍' },
		{ name: '实验项目' },
		{ name: '学生中心' },
		{ name: '资料下载' },
		{ name: '通知中心' }
	]
	$scope.curNav = 0
	$scope.isShowCourseDtl = false // 展示课程详情
	$scope.isShowTongzhiDtl = false // 展示通知详情
	$scope.curTongzhi = {}
	$scope.curCourse = {}
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
	$scope.listInfo = [{
		api: {
			list: ''
		}
	}]

	$scope.clickTab = function (item, idx) {
		$scope.curNav = idx
	}

	$scope.showTongzhi = function (item) {
		$scope.curTongzhi = item
		$scope.isShowTongzhiDtl = true
	}
	$scope.showCourse = function (item) {
		$scope.curCourse = item
		$scope.isShowCourseDtl = true
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