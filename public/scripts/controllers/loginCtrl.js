'use strict';

/**
 * @ngdoc function
 * @name authApp.controller:FormsWizardCtrl
 * @description
 * # FormsWizardCtrl
 * Controller of the authApp
 */
app
    .controller('loginCtrl', function ($scope, $state, loginSvc) {
        /*Modal*/

        $scope.login = function (obj) {
            loginSvc.create(obj, function (response) {
                if (response.data) {
                    window.sessionStorage.setItem('token', response.token)
                    window.localStorage.setItem('userName',response.data[0].userName)
                    $state.go('chat')
                }
                else {
                    alert('error')
                }
            });
        };
        
        // $scope.socialAuthbtn=function(){
        //     socialAuth.get(function(response){
        //         console.log(response)
        //     })
        // }

        $scope.data = [
            { 'id': 1, 'name': 'John', 'position': ['Jr Asst', 'Sr Asst', 'BD', 'GM'], 'office': ['TCS', 'Wipro', 'Infosys', 'IBM'], 'salary': 65000 },
            { 'id': 2, 'name': 'David', 'position': ['Jr Asst', 'Sr Asst', 'BD', 'GM'], 'office': ['TCS', 'Wipro', 'Infosys', 'IBM'], 'salary': 50000 },
            { 'id': 3, 'name': 'Ravi', 'position': ['Sr Developer'], 'office': ['TCS'], 'salary': 35000 },
            { 'id': 4, 'name': 'Alekya', 'position': ['GM'], 'office': ['IBM'], 'salary': 25000 },
            { 'id': 5, 'name': 'Saahithi', 'position': ['HR'], 'office': ['Wipro'], 'salary': 35000 },
            { 'id': 6, 'name': 'Niranjan', 'position': ['BD'], 'office': ['Genpact'], 'salary': 45000 },
            { 'id': 7, 'name': 'Neeraja', 'position': ['AGM'], 'office': ['Infosys'], 'salary': 95000 }

        ]
        // $scope.login=function (obj) {
        //     loginSvc.userlogin(obj)
        //     .then(function (response) {
        //         if(response.success){
        //             $state.go('vehicles')
        //         }
        //         else{
        //             alert('error')
        //         }
        //     });
        // };


    });
