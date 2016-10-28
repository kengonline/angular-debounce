angular.module('ng-debounce', [])
    .factory('CommonService', function () {
        return {
            getIndexByAttr: function (list, attrName, value) {
                if (!angular.isArray(list) || typeof attrName !== 'string') {
                    throw "error data type of arguments.";
                }

                var index = -1;

                list.forEach(function (data, i) {
                    if (data[attrName] === value) {
                        index = i;
                        return false;
                    }
                });

                return index;
            }
        };
    })
    .factory('$debounce', ['$timeout', 'CommonService', function ($timeout, CommonService) {
        var funcArr = [];
        return {
            debounce: function (func, waitTime) {
                if (typeof func !== 'function') {
                    throw "error data type of arguments.";
                }

                var index = CommonService.getIndexByAttr(funcArr, 'func', func);
                var timeout;

                if (index > -1) {
                    $timeout.cancel(funcArr[index].timeout);

                    funcArr[index].timeout = $timeout(function () {
                        var funcIndex = CommonService.getIndexByAttr(funcArr, 'func', func);
                        funcArr[funcIndex].func();
                        funcArr.splice(funcIndex, 1);
                    }, waitTime);
                } else {
                    timeout = $timeout(function () {
                        var funcIndex = CommonService.getIndexByAttr(funcArr, 'func', func);
                        funcArr[funcIndex].func();
                        funcArr.splice(funcIndex, 1);
                    }, waitTime);

                    funcArr.push({ func: func, waitTime: waitTime, timeout: timeout });
                }
            }
        }
    }]);