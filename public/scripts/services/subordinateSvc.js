/**
 * Created by CR6 on 28-04-2017.
 */
'use strict';

angular.module('authApp').factory('subordinateSvc', ['$resource', 'Config',
    function ($resource, Config) {
        var token = window.sessionStorage.getItem('token')

        return $resource(Config.url + 'subordinates', {
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
                    ,
                    headers: {
                        'x-access-token': token
                    }

                },
                get: {
                    method: 'GET',


                    isArray: false,
                }
            });
    }
]);


// headers: {
//     'x-access-token': window.sessionStorage.getItem('token')
// }
// ,