/* UNL App */
var app_main_unl = angular.module("unlMainApp", [
    "ui.router", 
    "ui.select", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
	"ngAnimate",
	"ui.knob",
	"ngCookies"
]); 

app_main_unl.run(function($rootScope) {
    $rootScope.imgpath = '/themes/adminLTE/unl_data/img/';
    $rootScope.angularCtlrPath = '/themes/adminLTE/unl_data/angular/controllers';
    $rootScope.jspath = '/themes/adminLTE/unl_data/js/';
    $rootScope.csspath = '/themes/adminLTE/unl_data/css/';
    $rootScope.pagespath = '/themes/adminLTE/unl_data/pages/';
    $rootScope.bodyclass = 'sidebar-collapse';
    $rootScope.UIlegacy = 1 ;
});

app_main_unl.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.focusOn) {
          elem[0].focus();
        }
      });
   };
});

app_main_unl.factory('focus', function ($rootScope, $timeout) {
  return function(name) {
	  console.log(name)
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  }
});

app_main_unl.directive('plumbItem', function() {
	return {
		controller: 'labController',
		link : function (scope, element, attrs) {
			jsPlumb.makeTarget(element);
		}
	};
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
app_main_unl.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

app_main_unl.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

app_main_unl.config(['$compileProvider', function($compileProvider) {
   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|telnet|vnc|rdp):/);
}]);

app_main_unl.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

/* Setup App Main Controller */
app_main_unl.controller('unlMainController', ['$scope', '$rootScope', '$http', '$location', '$cookies', function($scope, $rootScope, $http, $location, $cookies) {
		$rootScope.openLaba=true;
		console.log($cookies.get('privacy'));
		$scope.testAUTH = function (path) {
		$scope.userfolder='none';
		$http.get('/api/auth').then(
			function successCallback(response) {
				if (response.status == '200' && response.statusText == 'OK'){
				$rootScope.username=response.data.data.username;
				$rootScope.folder= (response.data.data.folder === null) ? '/' : response.data.data.folder;
				$rootScope.email=response.data.data.email;
				$rootScope.role=response.data.data.role;
				$rootScope.name=response.data.data.name;
				if (path != "/lab") $rootScope.lab=response.data.data.lab;
				$rootScope.lang=response.data.data.lang;
				$rootScope.tenant=response.data.data.tenant;
				$scope.userfolder = response.data.folder;
				console.log($rootScope.lab)
				// Preview need to get back to legacy UI
				if ( $rootScope.UIlegacy == 1) {
					if ($rootScope.lab === null ) {$location.path(path)} else {location.href ='/legacy/'};
					} else {
					if ($rootScope.lab === null ) {$location.path(path)} else {$location.path('/lab')};
					}
				}
			}, 
			function errorCallback(response) {
				if (response.status == '401' && response.statusText == 'Unauthorized'){
				$location.path("/login");}
				else {console.log("Unknown Error. Why did API doesn't respond?")}	
		});
		}
		$scope.testAUTH();
}]);

/* Setup Layout Part - Header */
app_main_unl.controller('HeaderController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
		$scope.activeClass='active';
		$scope.emptyClass='';
		$scope.currentPath=$location.path();
		$scope.logout = function() {
			$http.get('/api/auth/logout').then(
			function successCallback(response) {
				if (response.status == '200' && response.statusText == 'OK'){
				$location.path("/login");}
			}, 
			function errorCallback(response) {
				console.log("Unknown Error. Why did API doesn't respond?")	
				$location.path("/login");
			});	
		}
		$scope.blockui = function(position){
			if ($location.path() != position) blockUI()
		}
		$scope.activeLinks = {
			'main' : '/main',
			'usermgmt' : '/usermgmt',
			'syslog' : '/syslog',
			'sysstat' : '/main',
		}
		console.log($location.path())
}]);



/* Setup Rounting For All Pages */
app_main_unl.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, $scope) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login"); 
	
    //console.log($scope.userfolder)
	
    $stateProvider

        // LOGIN
        .state('login', {
            url: "/login",
            templateUrl: "/themes/adminLTE/unl_data/pages/login.html",            
            data: {pageTitle: 'Login'},
			controller: "loginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app_main_unl',
                        insertBefore: '#load_files_before',
                        files: [
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/loginCtrl.js'
                        ] 
                    });
                }]
            }
        })

        // MAIN_LAYOUT
        .state('main', {
            url: "/main",
            templateUrl: "/themes/adminLTE/unl_data/pages/main.html",
            data: {pageTitle: 'Main menu'},
			controller: "mainController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app_main_unl',
                        insertBefore: '#load_files_before',
                        files: [
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/mainCtrl.js',
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/modalCtrl.js',
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/labviewCtrl.js',
                             '/themes/adminLTE/plugins/angularJS/plugins/angular-file-upload/angular-file-upload.min.js',
							  '/themes/adminLTE/dist/css/skins/skin-blue.min.css',
                             '/themes/adminLTE/dist/js/app.min.js',
                        ] 
                    });
                }]
            }
        })
		// USER MANAGEMENT
        .state('usermgmt', {
            url: "/usermgmt",
            templateUrl: "/themes/adminLTE/unl_data/pages/usermgmt.html",
            data: {pageTitle: 'User management'},
			controller: "usermgmtController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app_main_unl',
                        insertBefore: '#load_files_before',
                        files: [
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/usermgmtCtrl.js',
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/modalCtrl.js'
                        ] 
                    });
                }]
            }
        })
		// SYSTEM LOG
        .state('syslog', {
            url: "/syslog",
            templateUrl: "/themes/adminLTE/unl_data/pages/syslog.html",
            data: {pageTitle: 'System logs'},
			controller: "syslogController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app_main_unl',
                        insertBefore: '#load_files_before',
                        files: [
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/syslogCtrl.js'
                        ] 
                    });
                }]
            }
        })
		// SYSTEM STAT
        .state('sysstat', {
            url: "/sysstat",
            templateUrl: "/themes/adminLTE/unl_data/pages/sysstat.html",
            data: {pageTitle: 'System status'},
			controller: "sysstatController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app_main_unl',
                        insertBefore: '#load_files_before',
                        files: [
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/sysstatCtrl.js',
							 '/themes/adminLTE/plugins/ng-knob/d3.min.js'
                        ] 
                    });
                }]
            }
        })
		//LAB LAYOUT
	.state('labnew', {
            url: "/lab",
            templateUrl: "/themes/adminLTE/unl_data/pages/lab/lab.html",
            data: {pageTitle: 'Lab'},
			controller: "labController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app_main_unl',
                        insertBefore: '#load_files_before',
                        files: [
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/lab/labCtrl.js',
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/lab/sidebarCtrl.js',
                             '/themes/adminLTE/dist/css/skins/skin-blue.min.css',
                             '/themes/adminLTE/plugins/ng-knob/d3.min.js',
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/lab/modalCtrl.js',
                             '/themes/adminLTE/unl_data/js/angularjs/controllers/lab/contextMenu.js',
							 '/themes/adminLTE/plugins/bootstrap-select/css/bootstrap-select.css',
							 '/themes/adminLTE/plugins/bootstrap-select/js/bootstrap-select.js',
                        ] 
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
app_main_unl.run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);
