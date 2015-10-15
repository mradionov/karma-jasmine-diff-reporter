describe('Option', function () {

  describe('Custom matchers', function () {

    beforeEach(function () {

      jasmine.addMatchers({
        toLookTheSameAs: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              if (expected === undefined) {
                expected = '';
              }
              var result = {};
              result.pass = util.equals(actual, expected, customEqualityTesters);

              result.message = 'Expected ' + actual;
              if (result.pass) {
                result.message += ' not';
              }
              result.message += ' to look the same as ' + expected + '.';

              return result;
            }
          };
        }
      });
    });

    it('should diff strings', function () {
      expect('bar').toLookTheSameAs('foo');
    });

    it('should NOT diff strings', function () {
      expect('bar').not.toLookTheSameAs('bar');
    });

    it('should diff objects', function () {
      var a = { foo: 'bar' },
          b = { baz: 'qux' };
      expect(a).toEqual(b);
    });

  });

});