function detailController(
  $scope,
  $http,
  $location,
  $window,
  $uibModal,
  $log,
  $rootScope,
  FileUploader,
  focus
) {
  $.unblockUI();
  $rootScope.openLaba = false;
  // $scope.testAUTH("/main"); //TEST AUTH
  //Default variables ///START
  console.log('Current user position: ' + $rootScope.folder);
  $scope.path =
    $rootScope.folder === undefined || $rootScope.folder == ''
      ? '/'
      : $rootScope.folder;
  $scope.newElementName = '';
  $scope.newElementToggle = false;
  $scope.fileSelected = false;
  $scope.allCheckedFlag = false;
  $scope.blockButtons = false;
  $scope.blockButtonsClass = '';
  $scope.fileManagerItem = [];
  $scope.checkboxArray = [];
  $scope.pstr = '';

  //Default variables ///END
  // $scope.apiBase = 'http://a26bgz.natappfree.cc';
  $scope.apiBase = 'http://' + location.hostname + ':9000';
  var EVENEWUSERNAME = localStorage.EVENEWUSERNAME || '';

  $scope.dtlData = {};
  var id = location.href.split('id=')[1].split('&')[0];
  var pstr = location.href.split('pstr=');
  $scope.pstr = pstr[1] ? pstr[1].split('&')[0] : '';
  $scope.getDtl = function () {
    var obj = {
      method: 'post',
      url:
        $scope.apiBase +
        '/api/article/get?id=' +
        id +
        '&username=' +
        EVENEWUSERNAME,
      parmas: {
        id: id,
        username: EVENEWUSERNAME,
      },
    };

    $http(obj).then(
      function successcallback(response) {
        console.log(response);
        if (response && response.data) {
          $scope.dtlData = response.data.data || {};
          let content = $scope.dtlData.content || '';
          $scope.dtlData.content = $scope.trustAsHtml(content);
          // console.log('dtl', $scope.dtlData);
        }
      },
      function errorcallback(response) {
        console.log("unknown error. why did api doesn't respond?");
        // $location.path("/login");
      }
    );
  };
  $scope.getDtl();

  $scope.goDtl = function (id) {
    location.href = '#/detail?id=' + id;
    location.reload();
  };
}
