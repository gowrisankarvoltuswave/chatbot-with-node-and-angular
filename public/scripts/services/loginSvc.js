/**
 * Created by CR6 on 28-04-2017.
 */
'use strict';
// angular.module('authApp')
// .service('loginSvc',function($http,$q){

//     this.userlogin=function(obj){
//         var dfd=$q.defer()
//         $http({
//             method:'POST',
//             url:'http://192.168.1.231:3001/users',
//             data:obj,
//             // headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    
//         })
//         .then(function(response){
//             dfd.resolve(response)
//             $http.defaults.headers.post['token'] =response.token;

//         })
//         .catch(function(response){
//             dfd.reject(response)

//         })
//         return dfd.promise;
//     }
// })

//Articles service used for communicating with the articles REST endpoints
angular.module('authApp').factory('loginSvc', ['$resource', 'Config',
    function ($resource, Config) {
        return $resource(Config.url + 'users', {
            username: '@username'
        }, {
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            },
            create: {
                method: 'POST'
            },
            get: {
                method: 'GET', isArray: false,
            }
        });
    }
]);
