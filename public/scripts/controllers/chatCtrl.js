'use strict';

/**
 * @ngdoc function
 * @name authApp.controller:FormsWizardCtrl
 * @description
 * # FormsWizardCtrl
 * Controller of the authApp
 */
app
    .controller('chatCtrl', function (chatSvc, subordinateSvc, submitleaveSvc, applyleaveSvc, $scope, $state, $timeout) {

        var agentSession = window.sessionStorage.getItem('agent')
        var agentSessionObj = JSON.parse(agentSession)
        init(agentSessionObj.access)

        if (agentSessionObj) {
            if (agentSessionObj.agent == 'leave') {
                $scope.lactive = true;
                $scope.agent='Leave Management System'
            }
            else if (agentSessionObj.agent == 'purchase') {
                $scope.pactive = true;
                $scope.agent='Purchase Management System'
            }
        }

        else {
            $scope.lactive = true;
            $scope.agent='Leave Management System'

        }
        var adaptiveCard = new AdaptiveCards.AdaptiveCard();
        adaptiveCard.onExecuteAction = function (action) {
            if (action.id == "timeline") {
                window.open(action.url, "");
            }
            else if (action.id == "subordinates") {
                if (action.data.key == "OK") {
                    console.log(action)
                    action.data['userId'] = action._originalData.userId
                    $scope.leadObj = action._originalData
                    if (action._originalData.actionName == 'Leave.status') {
                        subordinateSvc.create(action.data, function (response) {
                            if (response.success) {
                                $scope.list = response.data
                            }
                            else {
                                $scope.list = ''
                                $scope.myChat.mesageArr.push({ 'botMessage': response.message })
                                window.localStorage.setItem('message', JSON.stringify($scope.myChat.mesageArr))
                            }
                        })

                    }
                }
            }
            else if (action.id == "applyleave") {
                applyleaveSvc.create(action._originalData, function (response) {
                    if (response.card) {
                        var id_num = $scope.myChat.mesageArr.length
                        adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
                            fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
                            // More host config options
                        })
                        adaptiveCard.parse(response.message);

                        // Render the card to an HTML element:
                        var renderedCard = adaptiveCard.render();
                        var jsel = document.getElementById('cardMsg' + id_num)
                        jsel.appendChild(renderedCard);
                        // var el=angular.element(document).find('#cardMsg')
                        // var b =angular.element(jsel).append( $compile(renderedCard)($scope))
                        // var messagecard = renderedCard.innerHTML.replace(/\"/g, "\"")

                    }
                })
            }
            else if (action.id == "leaveformsubmit") {
                action.data['employeeId'] = action._originalData.userId
                submitleaveSvc.create(action.data, function (response) {
                    if (response.success) {
                        $scope.leaveRel = response.data
                        $scope.fromDate = new Date(response.data.fromDate)
                        $scope.toDate = new Date(response.data.toDate)
                        $scope.myChat.mesageArr.push({ 'botMessage': response.message })
                        window.localStorage.setItem('message', JSON.stringify($scope.myChat.mesageArr))
                    }
                })
            }
        }

        $scope.userName = window.localStorage.getItem('userName')
        $scope.myChat = { 'mesageArr': [] }
        function init(access){
            $scope.myChat ={}
            chatSvc.get({"id":access},function (response) {
                if (response.success) {
                    $scope.myChat = { 'mesageArr': response.data }
                }
    
                else {
                }
                $timeout(function () {
                    $scope.myChat.mesageArr.forEach(function (obj, index) {
                        if (obj.botMessage == null) {
                            var id_num = index + 1
                            adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
                                fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
                                // More host config options
                            })
                            let message = JSON.parse(obj.adaptiveCard)
                            adaptiveCard.parse(message);
    
                            // Render the card to an HTML element:
                            var renderedCard = adaptiveCard.render();
                            var jsel = document.getElementById('cardMsg' + id_num)
                            jsel.appendChild(renderedCard);
                        }
                    }), 1000
                })
            });
        }
       

        $scope.submitMessage = function (val) {
            if (val) {
                $scope.myChat.mesageArr.push({ 'userMessage': val, 'botMessage': '' })
                window.localStorage.setItem('message', JSON.stringify($scope.myChat.mesageArr))
                $scope.message = val
                $scope.val = "";
                var agentSession = window.sessionStorage.getItem('agent')
                var agentSessionObj = JSON.parse(agentSession)
                var obj = { 'val': $scope.message, 'access': agentSessionObj.access }
                chatSvc.create(obj, function (response) {
                    if (response.success) {
                        if (response.card) {
                            var id_num = $scope.myChat.mesageArr.length
                            adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
                                fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
                                // More host config options
                            })
                            adaptiveCard.parse(response.message);

                            // Render the card to an HTML element:
                            var renderedCard = adaptiveCard.render();
                            var jsel = document.getElementById('cardMsg' + id_num)
                            jsel.appendChild(renderedCard);
                            // var el=angular.element(document).find('#cardMsg')
                            // var b =angular.element(jsel).append( $compile(renderedCard)($scope))
                            // var messagecard = renderedCard.innerHTML.replace(/\"/g, "\"")

                        }
                        else {
                            $scope.myChat.mesageArr.push({ 'botMessage': response.message })
                            window.localStorage.setItem('message', JSON.stringify($scope.myChat.mesageArr))
                        }

                    }
                    else {
                        alert('JWT error')
                    }
                });
            }
        }

        $scope.selectAgent = function (agent, access) {
            if (agent == 'leave') {
                $scope.lactive = true;
                $scope.pactive = false;
                let agentObj = { "agent": agent, "access": access }
                $scope.agent='Leave Management System'
                window.sessionStorage.setItem('agent', JSON.stringify(agentObj))
                init(access)
            }
            else {
                $scope.pactive = true;
                $scope.lactive = false;
                $scope.agent='Purchase Management System'
                let agentObj = { "agent": agent, "access": access }
                window.sessionStorage.setItem('agent', JSON.stringify(agentObj))
                init(access)

            }
        }

        $scope.logout = function () {
            window.sessionStorage.removeItem('token')
            window.localStorage.removeItem('userName')
            $state.go('login')

        }
    });
