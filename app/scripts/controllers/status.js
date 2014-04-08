'use strict';

angular.module('reqmeappcliApp')
  .controller('StatusCtrl', function ($scope,Datafactory,firebaseRef,$modal,$location,localStorageService) {

        $scope.user=localStorageService.get('userData');
        $scope.listTrans=null;
        $scope.waitingMsg="Mohon Tunggu, Mengambil Data..";
        $scope.userId="";

        if(!($scope.user==null||$scope.user==undefined)){
            $scope.userId=$scope.user.child;
        }

        $scope.init=function(){
            $scope.data = firebaseRef('transactions')
                .startAt($scope.userId)
                .endAt($scope.userId)
                .on('value', function(snap) {
                    $scope.listTrans = snap.val();
                    $scope.waitingMsg=null;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                        //$digest or $apply
                    }



                });

        }



        /*firebaseRef('transactions')
            .startAt(userId)
            .endAt(userId)
            .on('value', function(snap) {
                $scope.listTrans = snap.val();
                $scope.waitingMsg=null;
                $scope.$apply();
            });*/
  });
