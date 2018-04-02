angular.module('ui.entity-data.modeler', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.entity-data.modeler').controller('ModelerCtrl', function ($uibModal, $log, $document, $scope) {
  var ctrl = this;
  ctrl.items = ['item1', 'item2', 'item3'];
  ctrl.entity = {};
  ctrl.$scope = $scope;

  ctrl.animationsEnabled = true;

  ctrl.okEntityProperties = function() {
  	
  	var clone = $scope.$parent.cell.value.clone();
	
	$scope.$parent.graph.model.setValue($scope.$parent.cell, clone);
  };
});
