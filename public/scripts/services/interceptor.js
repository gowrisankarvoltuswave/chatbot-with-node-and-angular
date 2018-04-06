app.factory('authInterceptor', function ($rootScope, $q, $window,$injector) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers['x-access-token'] = $window.sessionStorage.token;  
        }
        return config;
      },
      response: function (response) {
        if (response.data.status === 401) {
          delete $window.sessionStorage.token
          delete $window.sessionStorage.user
          $injector.invoke(function($state){
            $state.go('login')
          });
        }
          return response || $q.when(response);
  
      }
    };
  });
  
  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });