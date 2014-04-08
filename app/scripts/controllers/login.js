'use strict';

angular.module('reqmeappcliApp')
  .controller('LoginController', function($scope, simpleLogin, $location,firebaseRef,$rootScope,Datafactory,localStorageService) {
    $scope.pass = null;
    $scope.err = null;
    $scope.email = null;
    $scope.confirm = null;
    $scope.createMode = false;
    $scope.user = null;

    $scope.login = function(service) {
      simpleLogin.login(service, function(err,user) {
        $scope.err = err? err + '' : null;
        if( !err ) {
            firebaseRef('customer')
                .startAt(user.uid)
                .endAt(user.uid)
                .once('value', function(snap) {
                    if(snap.val()!=null){
                        $scope.user=snap.val();
                        var customerData=snap.val();
                            for (var key in customerData){
                                if (customerData.hasOwnProperty(key)) {
                                    $scope.user = customerData[key];
                                    $scope.user.child=key;
                                }
                            }
                    }else{
                        $scope.user=Datafactory.saveOnce(user,service);
                    }
                    localStorageService.clearAll();
                    localStorageService.add('userData',$scope.user);
                    //Datafactory.user=$scope.user;
                    if($scope.user.data_complete_status === null||$scope.user.data_complete_status ==='not_complete'){
                        $location.path('/profile');
                    }else{
                        $location.path('/posting');
                    }
                    $scope.$apply();
                });
        }
      });
    };

    $scope.loginPassword = function(cb) {
      $scope.err = null;
      if( !$scope.email ) {
        $scope.err = 'Please enter an email address';
      }
      else if( !$scope.pass ) {
        $scope.err = 'Please enter a password';
      }
      else {
        simpleLogin.loginPassword($scope.email, $scope.pass, function(err, user) {
          $scope.err = err? err + '' : null;
          console.log("email===>"+$scope.email);
          console.log("password==>"+$scope.pass);
          if( !err ) {
              $scope.user=user;
              $location.path("/");
          }
        });
      }
    };

    $scope.user = simpleLogin.checkUser;

    $scope.logout = simpleLogin.logout;

    $scope.createAccount = function() {
      function assertValidLoginAttempt() {
        if( !$scope.email ) {
          $scope.err = 'Please enter an email address';
        }
        else if( !$scope.pass ) {
          $scope.err = 'Please enter a password';
        }
        else if( $scope.pass !== $scope.confirm ) {
          $scope.err = 'Passwords do not match';
        }
        return !$scope.err;
      }

      $scope.err = null;
      if( assertValidLoginAttempt() ) {
        simpleLogin.createAccount($scope.email, $scope.pass, function(err, user) {
          if( err ) {
            $scope.err = err? err + '' : null;
          }
          else {
            // must be logged in before I can write to my profile
            $scope.login(function() {
              simpleLogin.createProfile(user.uid, user.email);
              $location.path('/account');
            });
          }
        });
      }
    };

  });
