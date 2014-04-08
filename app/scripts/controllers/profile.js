'use strict';

angular.module('reqmeappcliApp')
  .controller('ProfileCtrl', function ($scope,Datafactory,firebaseRef,$modal,$location,localStorageService) {



        $scope.updateButton="Update Profile";
        $scope.updateStatus=function(e){
            return false;
        }
        //$scope.user=Datafactory.user;
        $scope.user=localStorageService.get('userData');



        $scope.onBusinessPlaceFileSelect = function($files) {
            $scope.progressBusinessPlaceFile=0;
            $scope.$apply();
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var filePayload = e.target.result;
                        firebaseRef('customer/'+$scope.user.child)
                            .child('business_place_file').set(filePayload,function(){
                                $scope.progressBusinessPlaceFile = parseInt(100.0 * e.loaded / e.total);
                                $scope.user.business_place_file=filePayload;
                                $scope.$apply();
                            });
                    };
                })(file);
                reader.readAsDataURL(file);
            }
        }


        $scope.onIdCardFileSelect = function($files) {
            $scope.progressIdCardFile=0;
            $scope.$apply();
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {
                            var filePayload = e.target.result;
                            firebaseRef('customer/'+$scope.user.child)
                                .child('id_card_file').set(filePayload,function(){
                                    $scope.progressIdCardFile = parseInt(100.0 * e.loaded / e.total);
                                    $scope.user.id_card_file=filePayload;
                                    $scope.$apply();
                                });
                        };
                    })(file);
                    reader.readAsDataURL(file);
            }
        }


        $scope.onFamilyIdFile = function($files) {
            $scope.progressFamilyIdFile=0;
            $scope.$apply();
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var filePayload = e.target.result;
                        firebaseRef('customer/'+$scope.user.child)
                            .child('family_id_file').set(filePayload,function(){
                                $scope.progressFamilyIdFile = parseInt(100.0 * e.loaded / e.total);
                                $scope.user.family_id_file=filePayload;
                                $scope.$apply();
                            });
                    };
                })(file);
                reader.readAsDataURL(file);
            }
        }


        $scope.onDefaultGeneralFile = function($files) {
            $scope.progressDefaultGeneralFile=0;
            $scope.$apply();
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var filePayload = e.target.result;
                        firebaseRef('customer/'+$scope.user.child)
                            .child('default_general_file').set(filePayload,function(){
                                $scope.progressDefaultGeneralFile = parseInt(100.0 * e.loaded / e.total);
                                $scope.user.default_general_file=filePayload;
                                $scope.$apply();
                            });
                    };
                })(file);
                reader.readAsDataURL(file);
            }
        }

        $scope.onIncomeCertificateFile = function($files) {
            $scope.progressIncomeCertificateFile=0;
            $scope.$apply();
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var filePayload = e.target.result;
                        firebaseRef('customer/'+$scope.user.child)
                            .child('income_certificate_file').set(filePayload,function(){
                                $scope.progressIncomeCertificateFile = parseInt(100.0 * e.loaded / e.total);
                                $scope.user.income_certificate_file=filePayload;
                                $scope.$apply();
                            });
                    };
                })(file);
                reader.readAsDataURL(file);
            }
        }

        $scope.register=function(){
            $scope.updateButton="Mengupdate Data";
            $scope.updateStatus=function(e){
                return true;
            };
            if($scope.user.income_certificate_file!=null &&
                $scope.user.default_general_file!=null &&
                $scope.user.family_id_file!=null &&
                $scope.user.id_card_file!=null
                ){
                $scope.user.data_complete_status='complete';
            }

            firebaseRef('customer/'+$scope.user.child).update($scope.user,function(){
                    localStorageService.remove('userData');
                    localStorageService.add('userData',$scope.user);
                    $scope.user=localStorageService.get('userData');

                var modalInstance = $modal.open({
                    templateUrl: 'notifContent.html',
                    controller: NotifInstanceCtrl,
                    resolve: {
                        resultMsg: function () {
                            return "Terima Kasih Telah Melengkapi data Profil, apakah anda akan melanjutkan proses Upload Data?";
                        },
                        result: function () {
                            return "Sukses";
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if(result=="Ok"){
                        $location.path("/upload");
                    }else{
                        $location.path("/");
                    }
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
                    $scope.$apply();
                    console.log("success update data");
                });
        }
  });


var NotifInstanceCtrl = function ($scope, $modalInstance,resultMsg,result) {
    $scope.result=result;
    $scope.resultMsg=resultMsg;
    $scope.ok = function () {
        $modalInstance.close('Ok');
    };

    $scope.skip = function () {
        $modalInstance.close('Skip');
    };
};