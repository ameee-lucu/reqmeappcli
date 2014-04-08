'use strict';

angular.module('reqmeappcliApp')
  .controller('PostingCtrl', function ($scope,Datafactory,firebaseRef,$modal,$location,localStorageService) {
        $scope.internet=false;
        $scope.offline=true;
        $scope.listLeasing=null;
        $scope.selectedLeasing=null;
        $scope.selectedTenor=null;
        $scope.sellerAddress=null;
        $scope.sellerPhone=null;

        $scope.selectedYear=null;
        $scope.price=null;
        $scope.angsuran="-";
        $scope.downpayment="-";
        $scope.transId=null;
        $scope.imageFile=null;
        $scope.progressImageUpload=0;
        $scope.listImage=[];
        $scope.hideImage=true;
        $scope.leasingId=null;
        $scope.tenorId=null;
        $scope.result="Gagal";
        $scope.link=null;
        $scope.type=null;
        $scope.user=localStorageService.get('userData');
        $scope.motorId=null;
        $scope.motor=null;
        $scope.cair=null;
        $scope.otr=null;
        $scope.errPrice=null;
        $scope.angsuranMsg=null;
        $scope.downpaymentMsg=null;

        $scope.radioModel = 'Internet';

        $scope.listMotor=[];

        $scope.updateButton="Submit Request";
        $scope.updateStatus=function(e){
            return false;
        }


        $scope.onSetMerck=function(merck){
            if(merck!==null&& merck!=undefined){
                firebaseRef('vehicle_data/Adira')
                    .startAt(merck)
                    .endAt(merck)
                    .once('value', function(snap) {
                        var motorData=snap.val();
                        //console.log(JSON.stringify(snap.val(), null, 2));
                        for (var key in motorData){
                            if (motorData.hasOwnProperty(key)) {
                                $scope.motorId=key;
                                $scope.motor=motorData[key];
                            }
                        }

                        //console.log("2009==>"+$scope.motor["2010"]);
                    });
                //calculateDp();
            }
            //$scope.$apply();
        }

        $scope.getMerckName = function(val) {

            if(val!==null&& val!=undefined){
                val=val.toUpperCase();
                firebaseRef('vehicle_data/Adira')
                    .startAt(val)
                    .limit(5)
                    .once('value', function(snap) {
                        $scope.listMotor=[];
                        var motorData=snap.val();
                        //console.log(JSON.stringify(snap.val(), null, 2));
                        for (var key in motorData){
                            if (motorData.hasOwnProperty(key)) {
                                $scope.motorId=key;
                                $scope.motor=motorData[key];
                                $scope.listMotor.push($scope.motor);
                            }
                        }


                    });
                return $scope.listMotor;
            }
        };





$scope.posting=function(){

            $scope.updateButton="Submit Permintaan..";
            $scope.updateStatus=function(e){
                return true;
            }

            //console.log("Ini ajah==>"+$scope.user);

            if($scope.transId==null||$scope.transId==undefined){
                var ref=firebaseRef('transactions')
                    .push();
                $scope.transId=ref.name();
                ref.setWithPriority({'init':true},$scope.user.child,function(err){
                    console.log("done setting initial value");
                });
            }

            firebaseRef('transactions/'+$scope.transId)
                .update(
                {
                    'customer':$scope.user.child,
                    'type':$scope.type,
                    'merck':$scope.merck==null||$scope.merck==undefined?"":$scope.merck,
                    'color':$scope.color==null||$scope.color==undefined?"":$scope.color,
                    'year':$scope.selectedYear,
                    'price':$scope.price,
                    'otr':$scope.otr,
                    'cair':$scope.cair,
                    'seller_address':$scope.sellerAddress==null||$scope.sellerAddress==undefined?"":$scope.sellerAddress,
                    'selller_phone':$scope.sellerPhone==null||$scope.sellerPhone==undefined?"":$scope.sellerPhone,
                    'leasing':$scope.leasingId,
                    'tenor':$scope.tenorId,
                    'exp_downpayment':$scope.downpayment,
                    'exp_angsuran':$scope.angsuran,
                    'url':$scope.link==null||$scope.link==undefined?"":$scope.link,
                    'unit_status':'Init', //on init, progress, failed, ok
                    'data_status':'Init',
                    'survey_status':'Init',
                    'delivery_status':'Init',
                    'approval_status':'Init',
                    'request_date':Date.now(),
                    'uid':$scope.transId,
                    'leasing_otr':$scope.otr,
                    'leasing_dp':$scope.grossdp,
                    'leasing_angsuran':$scope.angsuran
                },function(err){
                    if(!err){
                        $scope.$apply();
                        var modalInstance = $modal.open({
                            templateUrl: 'myModalContent.html',
                            controller: ModalInstanceCtrl,
                            resolve: {
                                resultMsg: function () {
                                    return "Sukses Posting Request Kredit, Mohon Tunggu Response Kami < 24 Jam";
                                },
                                result: function () {
                                    return "Sukses";
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {
                            if(result=="Ok" || result=="Cancel"){
                                $location.path("/");
                            }
                        }, function () {
                            //$log.info('Modal dismissed at: ' + new Date());
                        });
                        $scope.$apply();
                    }
                });

}

        $scope.onImageFileSelect = function($files) {
            $scope.hideImage=true;
            $scope.progressImageUpload=0;
            $scope.$apply();

            if($scope.transId==null||$scope.transId==undefined){
                var ref=firebaseRef('transactions')
                    .push();
                $scope.transId=ref.name();
                ref.setWithPriority({'init':true},$scope.user.child,function(err){
                    console.log("done setting initial value");
                });
            }

            console.log("transid===>"+$scope.transId);
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var filePayload = e.target.result;
                        var ref=firebaseRef('transactions/'+$scope.transId)
                            .child('image').push().set(filePayload,function(){
                                $scope.progressImageUpload = parseInt(100.0 * e.loaded / e.total);
                                $scope.listImage.push(filePayload);
                                $scope.$apply();
                            });
                    };
                })(file);
                reader.readAsDataURL(file);
            }
            $scope.hideImage=false;
        }


        firebaseRef('leasing')
            .once('value', function(snap) {
                //console.log("snap now===>"+JSON.stringify(snap.val(), null, 2));
                $scope.listLeasing = snap.val();
                $scope.$apply();
            });

        firebaseRef('tenor')
            .once('value', function(snap) {
                //console.log("snap now===>"+JSON.stringify(snap.val(), null, 2));
                $scope.listTenor = snap.val();
                $scope.$apply();
            });

        function validateParam(){
            if($scope.selectedLeasing==null||$scope.selectedLeasing==undefined||
                $scope.selectedTenor==null||$scope.selectedTenor==undefined||
                $scope.selectedYear==null||$scope.selectedYear==undefined||
                $scope.price==null||$scope.price==undefined||
                $scope.motor==null||$scope.motor==undefined){
                return false;
            }else{
                return true;
            }
        }

        function calculateDp(){
            if(validateParam()==false){
                //console.log("ini ngga masuk");
                return "-";
            }else{
                $scope.angsuranMsg="Menghitung Perkiraan Angsuran..";
                $scope.downpaymentMsg="Menghitung Perkiraan DP / Uang Muka..";
                //console.log("ngga null");
                firebaseRef('leasing')
                    .startAt($scope.selectedLeasing)
                    .endAt($scope.selectedLeasing)
                    .once('value', function(snap) {
                        var leasingData=snap.val();
                        for (var key in leasingData){
                            if (leasingData.hasOwnProperty(key)) {
                                $scope.leasingId = key;
                            }
                        }

                        firebaseRef('tenor')
                            .startAt($scope.selectedTenor)
                            .endAt($scope.selectedTenor)
                            .once('value', function(snap) {
                                var tenorData=snap.val();
                                for (var key in tenorData){
                                    if (tenorData.hasOwnProperty(key)) {
                                        $scope.tenorId = key;
                                        $scope.tenor=tenorData[key];
                                    }
                                }

                                //console.log("leasing Id==>"+$scope.leasingId);
                                //console.log("tenor Id==>"+$scope.tenorId);


                                var formulaId=$scope.leasingId+$scope.tenorId;
                                //console.log("formula Id==>"+formulaId);
                                firebaseRef('formula')
                                    .startAt(formulaId)
                                    .endAt(formulaId)
                                    .once('value', function(snap) {
                                        var formulaData=snap.val();
                                        //console.log(JSON.stringify(snap.val(), null, 2));
                                        for (var key in formulaData){
                                            if (formulaData.hasOwnProperty(key)) {
                                                $scope.formulaId = key;
                                                $scope.formula=formulaData[key];
                                            }
                                        }


                                        var thisYear=new Date().getFullYear();

                                        //console.log("tahun pilihan==>"+$scope.selectedYear);
                                        //console.log("tahun ini======>"+thisYear);

                                        var selisih=thisYear-$scope.selectedYear;

                                        //console.log("selisih==>"+selisih);

                                        var index=null;

                                        if(selisih<=2){
                                                index=2;
                                        }else if(selisih<=4){
                                                index=4;
                                        }else if(selisih>=5){
                                                index=5;
                                        }
                                        //console.log("index==>"+index);

                                        firebaseRef('base')
                                            .startAt($scope.leasingId+index)
                                            .endAt($scope.leasingId+index)
                                            .once('value', function(snap) {
                                                var baseData=snap.val();
                                                //console.log(JSON.stringify(snap.val(), null, 2));
                                                for (var key in baseData){
                                                    if (baseData.hasOwnProperty(key)) {
                                                        $scope.baseId = key;
                                                        $scope.base=baseData[key];
                                                    }
                                                }
                                                //console.log("base Id===>"+$scope.baseId);

                                                //console.log("fidusia==>"+$scope.base.fidusia);
                                                //console.log("dp==>"+$scope.base.down_payment);

                                                //console.log("downpayment==>"+$scope.downpayment);
                                                $scope.otr=$scope.motor[$scope.selectedYear];
                                                var grossDp=($scope.otr*($scope.base.down_payment/100))+$scope.base.fidusia;
                                                var minDp=(11/100)*parseFloat($scope.otr);
                                                var afterSales=300000;
                                                var affiliate=200000;

                                                if(minDp<1000000){
                                                    minDp=1000000;
                                                }

                                                var sisaDp=minDp-afterSales-affiliate;

                                                var imax=parseFloat($scope.otr)-grossDp+sisaDp;

                                                var cair=parseFloat($scope.otr)-grossDp;
                                                var harga=parseFloat($scope.price);
                                                var selisih = cair-harga;
                                                var asuransi=parseFloat($scope.formula.insurance/100);
                                                var adm=parseFloat($scope.formula.admin_fee);
                                                var depe=parseFloat($scope.downpayment);
                                                var pengali=parseFloat($scope.formula.multiplier);
                                                var tenor=parseFloat($scope.tenor.tenor);

                                                $scope.grossdp=grossDp;

                                                if(imax > harga){
                                                    console.log("masuk harga minimum");
                                                    $scope.downpayment=minDp;
                                                    console.log("dp===>"+$scope.downpayment);
                                                    cair=cair-sisaDp-(cair-harga);
                                                    $scope.otr=((cair+$scope.base.fidusia)*10)/8;
                                                    asuransi=parseFloat($scope.formula.insurance/100);
                                                    adm=parseFloat($scope.formula.admin_fee);
                                                    depe=parseFloat($scope.downpayment);
                                                    pengali=parseFloat($scope.formula.multiplier);
                                                    tenor=parseFloat($scope.tenor.tenor);
                                                    var angsur=((($scope.otr+($scope.otr*asuransi)+adm-depe))*pengali)/tenor;
                                                    $scope.angsuran=angsur.toFixed(0);
                                                    $scope.cair=cair;
                                                }else{
                                                    console.log("masuk harga maksimum");
                                                    //$scope.downpayment=($scope.price*($scope.base.down_payment/100))+$scope.base.fidusia;
                                                    $scope.downpayment=minDp+Math.abs(parseFloat($scope.otr)-imax);
                                                    console.log("dp===>"+$scope.downpayment);
                                                    asuransi=parseFloat($scope.formula.insurance/100);
                                                    adm=parseFloat($scope.formula.admin_fee);
                                                    depe=parseFloat($scope.downpayment);
                                                    pengali=parseFloat($scope.formula.multiplier);
                                                    tenor=parseFloat($scope.tenor.tenor);
                                                    var angsur=((($scope.otr+($scope.otr*asuransi)+adm-depe))*pengali)/tenor;
                                                    $scope.angsuran=angsur.toFixed(0);
                                                    $scope.cair=cair;
                                                }

                                                $scope.angsuranMsg=null;
                                                $scope.downpaymentMsg=null;
                                                $scope.$apply();
                                            });
                                    });
                            });
                    });
                return "-";
            }

        }




        $scope.range=function(){
            var start=2000;
            var end = new Date().getFullYear();
            var input = [];
            for (var i = start; i <= end; i += 1) input.push(i);
            return input;
        }

        $scope.onSetLeasing=function(leasing){
            $scope.selectedLeasing=leasing;
            //console.log("selected leasing==>"+$scope.selectedLeasing);
            calculateDp();
        }


        $scope.onSetTenor=function(tenor){
            $scope.selectedTenor=tenor;
            //console.log("selected tenor==>"+$scope.selectedTenor);
            calculateDp();
        }

        $scope.onSetYear=function(year){
            $scope.selectedYear=year;
            //console.log("selected year==>"+$scope.selectedYear);
            calculateDp();
        }

        $scope.onSetPrice=function(price){
            $scope.errPrice=null;
            $scope.price=price;
            var otr=$scope.motor[$scope.selectedYear];
            console.log("otr===>"+otr);
            var hargaJual=parseFloat($scope.price)+1000000;
            console.log("hargajual===>"+hargaJual);
            if(hargaJual>=otr){
                $scope.errPrice="Harga Jual Anda melebihi Harga Standar Pasar"
            }else{
                calculateDp();
            }
            //console.log("selected price==>"+$scope.price);

        }

        $scope.onClickRdio=function(type){
            $scope.type=type;
            if(type==='internet'){
                $scope.internet=false;
                $scope.offline=true;
                $scope.selectedLeasing=null;
                $scope.selectedTenor=null;
                $scope.downpayment="-";
                $scope.selectedYear=null;
                $scope.price=null;
                $scope.angsuran="-";
            }else{
                $scope.internet=true;
                $scope.offline=false;
                $scope.selectedLeasing=null;
                $scope.selectedTenor=null;
                $scope.downpayment="-";
                $scope.selectedYear=null;
                $scope.price=null;
                $scope.angsuran="-";
            }
        }
  });

var ModalInstanceCtrl = function ($scope, $modalInstance,resultMsg,result) {
    $scope.result=result;
    $scope.resultMsg=resultMsg;
    $scope.ok = function () {
        $modalInstance.close('Ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Cancel');
    };
};