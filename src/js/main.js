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
                    return b.rating - a.rating;
                } else {
                    return 0;
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
        // Cache the original language list to avoid repeated service calls
        var originalLanguages = LanguageService.getLanguages();
        $scope.languages = angular.copy(originalLanguages);

        $scope.sortRatingOptions = ['none', 'low', 'high'];
        $scope.langsort = $scope.sortRatingOptions[0];
        $scope.langsortChanged = function() {
            if ($scope.langsort === 'none') {
                //resets our languages back to the original list
                $scope.languages = angular.copy(originalLanguages);
            } else {
                $scope.languages = $filter('languageRatingFilter')(originalLanguages, $scope.langsort);
            }
        };
    }]);
