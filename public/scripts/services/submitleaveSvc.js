/**
 * Created by CR6 on 28-04-2017.
 */
'use strict';

angular.module('authApp').factory('submitleaveSvc', ['$resource', 'Config',
    function ($resource, Config) {
        var token = window.sessionStorage.getItem('token')

        return $resource(Config.url + 'submitleave', {
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


                    isArray: true,
                }
            });
    }
]);


// headers: {
//     'x-access-token': window.sessionStorage.getItem('token')
// }
// ,