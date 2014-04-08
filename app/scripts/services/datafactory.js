'use strict';

angular.module('reqmeappcliApp')
  .factory('Datafactory', function Datafactory(firebaseRef) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return{
            saveOnce : function(user,provider){
                var ref=firebaseRef('customer')
                    .push();
                user.child=ref;
                ref.setWithPriority({
                    'uid':user.uid,
                    'email':(user.email == undefined ||user.email == null ?'':user.email),
                    'login_using':provider,
                    'auth_id':user.id,
                    'access_token':(user.accessToken == undefined ||user.accessToken == null ?'':user.accessToken),
                    'access_token_secret':(user.accessTokenSecret == undefined ||user.accessTokenSecret == null ?'':user.accessTokenSecret),
                    'name':user.displayName,
                    'data_complete_status':'not_complete'
                }, user.uid);


            },

            testFile : function(user,file){
                firebaseRef('customer/'+user.child)
                    .child('file').set(file);
            },

            user : function(user){
                return user;
            },


            saveNewCustomer : function(customer){
                firebaseRef('customer/'+id)
                    .set({
                        'login_using':customer.provider,
                        'email':customer.email,
                        'name':customer.name,
                        'id_no':customer.id_no,
                        'address':customer.address,
                        'birth_place':customer.birth_place,
                        'birth_date':customer.birth_date,
                        'phone':customer.phone,
                        'handphone':customer.handphone,
                        'job':customer.job,
                        'office_address':customer.office_address,
                        'office_phone':customer.office_phone,
                        'id_card_file':customer.id_card_file,
                        'family_id_file':customer.family_id_file,
                        'default_general_file':customer.default_general_file,
                        'income_certificate_file':customer.income_certificate_file
                    },function(err) {
                        //err && console.error(err);
                        if( callback ) {
                            $timeout(function() {
                                callback(err);
                            });
                        }
                    });
            },
            saveNewUser : function(user,id){
                firebaseRef('user/'+id)
                    .set({
                        'email':user.email,
                        'type':user.type,
                        'phone_no':user.phone_no,
                        'name':user.name
                    },function(err) {
                        //err && console.error(err);
                        if( callback ) {
                            $timeout(function() {
                                callback(err);
                            });
                        }
                    });
            },

            saveNewLeasing : function(leasing,id){
                firebaseRef('leasing/'+id)
                    .set({
                        'name':leasing.name,
                        'address':leasing.address,
                        'bonus':leasing.bonus,
                        'formula' : {}
                    },function(err) {
                        //err && console.error(err);
                        if( callback ) {
                            $timeout(function() {
                                callback(err);
                            });
                        }
                    });
            },


            saveNewProduct : function(product,id){
                firebaseRef('leasing/'+id)
                    .set({
                        'type':product.type,
                        'merck':product.merck,
                        'model':product.model,
                        'color':product.color,
                        'year':product.year,
                        'address':product.address,
                        'phone_no':product.phone_no,
                        'image_file':product.image_file
                    },function(err) {
                        //err && console.error(err);
                        if( callback ) {
                            $timeout(function() {
                                callback(err);
                            });
                        }
                    });
            },

            saveNewTransactions : function(transactions,id){
                firebaseRef('transactions/'+id)
                    .set({
                        'customer':transactions.customer,
                        'leasing':transactions.leasing,
                        'tenor':transactions.tenor,
                        'product':transactions.product,
                        'unit_status':transactions.unit_status,
                        'data_status':transactions.data_status,
                        'survey_status':transactions.survey_status,
                        'delivery_status':transactions.delivery_status
                    },function(err) {
                        //err && console.error(err);
                        if( callback ) {
                            $timeout(function() {
                                callback(err);
                            });
                        }
                    });
            }


        }
  });
