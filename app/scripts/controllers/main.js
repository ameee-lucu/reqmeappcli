'use strict';

angular.module('reqmeappcliApp')
  .controller('MainCtrl', function ($scope,$location,localStorageService) {

        $scope.user=localStorageService.get('userData');

        $scope.posting=function(){
            if($scope.user==null||$scope.user==undefined){
                $location.path("/login");
            }else{
                $location.path("/posting");
            }
        }




  });


