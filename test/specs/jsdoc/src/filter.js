/*global beforeEach, describe, expect, it, jasmine */
describe('jsdoc/src/filter', function() {
    var filter = require('jsdoc/src/filter');
    var path = require('jsdoc/path');

    it('should exist', function() {
        expect(filter).toBeDefined();
        expect(typeof filter).toBe('object');
    });

    it('should export a "Filter" class', function() {
        expect(filter.Filter).toBeDefined();
        expect(typeof filter.Filter).toBe('function');
    });

    describe('Filter', function() {
        var myFilter;

        beforeEach(function() {
            myFilter = new filter.Filter({});
        });
        it('should have an "exclude" property', function() {
            expect(myFilter.exclude).toBeDefined();
        });

        it('should have an "excludePattern" property', function() {
            expect(myFilter.excludePattern).toBeDefined();
        });

        it('should have an "includePattern" property', function() {
            expect(myFilter.includePattern).toBeDefined();
        });

        it('should have an "isIncluded" method', function() {
            expect(myFilter.isIncluded).toBeDefined();
            expect(typeof myFilter.isIncluded).toBe('function');
        });

        describe('exclude', function() {
            it('should default to null', function() {
                expect(myFilter.exclude).toBe(null);
            });

            it('should be null if the value passed to the constructor was not an array',
                function() {
                myFilter = new filter.Filter({
                    exclude: 'foo'
                });

                expect(myFilter.exclude).toBe(null);
            });

            it('should resolve paths relative to the user\'s working directory', function() {
                var filename = 'bar.js';
                myFilter = new filter.Filter({
                    exclude: [filename]
                });

                expect(myFilter.exclude).toEqual([path.resolve(global.env.pwd, filename)]);
            });
        });

        function testRegExpProperty(name) {
            it('should default to null', function() {
                expect(myFilter[name]).toBe(null);
            });

            it('should contain the regexp passed to the constructor', function() {
                var regExp = new RegExp('^foo$');
                var options = {};
                options[name] = regExp;
                myFilter = new filter.Filter(options);

                expect(myFilter[name]).toBe(regExp);
            });

            it('should contain a regexp if a string was passed to the constructor', function() {
                var regExpString = '^foo$';
                var options = {};
                options[name] = regExpString;
                myFilter = new filter.Filter(options);

                expect(myFilter[name] instanceof RegExp).toBe(true);
                expect(myFilter[name].source).toBe(regExpString);
            });
        }

        describe( 'excludePattern', testRegExpProperty.bind(jasmine, 'excludePattern') );

        describe( 'includePattern', testRegExpProperty.bind(jasmine, 'includePattern') );

        describe('isIncluded', function() {
            var files = [
                'yes.js',
                '/yes.jsdoc',
                '/_nope.js',
                '.ignore',
                path.normalize(global.env.pwd + '/scratch/conf.js')
            ];
            myFilter = new filter.Filter({
                includePattern: new RegExp('.+\\.js(doc)?$'),
                excludePattern: new RegExp('(^|\\/|\\\\)_'),
                exclude: ['.ignore', 'scratch/conf.js']
            });

            files = files.filter(function($) {
                return myFilter.isIncluded($);
            });

            it('should return the correct source files', function() {
                expect(files.length).toEqual(2);
                expect( files.indexOf('yes.js') ).toBeGreaterThan(-1);
                expect( files.indexOf('/yes.jsdoc') ).toBeGreaterThan(-1);
            });
        });
    });

});
