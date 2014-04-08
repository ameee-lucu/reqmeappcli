'use strict';

describe('Controller: PostingCtrl', function () {

  // load the controller's module
  beforeEach(module('reqmeappcliApp'));

  var PostingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostingCtrl = $controller('PostingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
