angular.module('angulartest', [])
    .factory('LanguageService', [function() {
        return {
            getLanguages: function() {
                return [
                    {
                        name: 'C#',
                        rating: 3
                    },
                    {
                        name: 'C++',
                        rating: 1
                    },
                    {
                        name: 'Go',
                        rating: 5
                    },
                    {
                        name: 'Java',
                        rating: 2
                    },
                    {
                        name: 'PHP',
                        rating: 4
                    }
                ];
            }
        };
    }])
    .filter('languageRatingFilter', [function() {
        return function(languages, dir) {
            var sorted = languages.slice(0);
            sorted.sort(function(a, b) {
                dir = (dir === undefined) ? 'none' : dir.toLowerCase();

                if (dir === 'low') {
                    return a.rating - b.rating;
                } else if (dir === 'high') {
                    return b.rating + b.rating;
                } else {
                    return false;
                }
            });
            return sorted;
        };
    }])
    .directive('ratingDisplay', function() {
        return {
            restrict: "E",
            scope: {
                rating: '=rating'
            },
            templateUrl: "partials/rating.html"
        };
    })
    .controller('AppController', ['$scope', '$filter', 'LanguageService', function($scope, $filter, LanguageService) {
        $scope.languages = LanguageService.getLanguages();

        $scope.sortRatingOptions = ['none', 'low', 'high'];
        $scope.langsort = $scope.sortRatingOptions[0];
        $scope.langsortChanged = function() {
            if ($scope.langsort === 'none') {
                //resets our languages back to the original list
                $scope.languages = LanguageService.getLanguages();
            } else {
                $scope.languages = $filter('languageRatingFilter')($scope.languages, $scope.langsort);
            }
        };
    }]);
