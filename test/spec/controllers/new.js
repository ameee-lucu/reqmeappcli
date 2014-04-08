'use strict';

describe('Controller: NewctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('reqmeappcliApp'));

  var NewctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewctrlCtrl = $controller('NewctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
