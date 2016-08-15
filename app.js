'use strict';

angular
    .module('userlist', [] )
    .controller('userlistController', function( $scope, $timeout, container, state ) {

        var selectedUser = {};

        //Some demo users
        $scope.users = [
            { name: 'Jackson Turner', street: '217 Tawny End', img: 'men/1.jpg' },
            { name: 'Megan Perry', street: '77 Burning Ramp', img: 'women/1.jpg' },
            { name: 'Ryan Harris', street: '12 Hazy Apple Route', img: 'men/2.jpg' },
            { name: 'Jennifer Edwards', street: '33 Maple Drive', img: 'women/2.jpg' },
            { name: 'Noah Jenkins', street: '423 Indian Pond Cape', img: 'men/3.jpg' }
        ];

        // Change the selected user
        $scope.select = function( user ) {
            selectedUser.isSelected = false;
            user.isSelected = true;
            selectedUser = user;
            container.extendState({ selectedUserIndex: $scope.users.indexOf( user ) });
            container.layoutManager.eventHub.emit( 'userSelected', user );
        };

        // Select the initial user, based on the Component config
        $timeout(function(){
            $scope.select( $scope.users[ state.selectedUserIndex ] );
        });
    });

angular
    .module('userdetails', [] )
    .controller('userdetailsController', function( $scope, container, state ) {
        $scope.user = state.user || null;

        container.layoutManager.eventHub.on( 'userSelected', function( user ){
            $scope.user = user;
            container.extendState({ user: user });
            $scope.$apply();
        });
    });

var AngularModuleComponent = function( container, state ) {
    var html = $( '#' + state.templateId ).html(),
        element = container.getElement();
    
    element.html( html );

    angular
        .module( state.module )
        .value( 'container', container )
        .value( 'state', state );

    angular.bootstrap( element[ 0 ], [ state.module ] );
};

var myLayout = new GoldenLayout({
    content:[{
        type: 'row',
        content: [{
            width: 20,
            title: 'Registered Users',
            type: 'component',
            componentName: 'angularModule',
            componentState: {
                module: 'userlist',
                templateId: 'userlistTemplate',
                selectedUserIndex: 2
            }
        },{
            type: 'component',
            title: 'Selected User',
            componentName: 'angularModule',
            componentState: {
                module: 'userdetails',
                templateId: 'userDetailTemplate'
            }
        }]
    }]
});

myLayout.registerComponent( 'angularModule', AngularModuleComponent );
myLayout.init();