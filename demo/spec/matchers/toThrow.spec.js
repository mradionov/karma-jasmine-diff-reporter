describe('Matcher', function () {

  describe('toThrow', function () {

    it('should diff', function () {
      var foo = function () {
        return a + 1;
      };
      expect(foo).toThrow(new TypeError('boo'));
    });

  });

  describe('toThrowError', function () {

    it('should diff', function () {
      var foo = function () {
        throw new ReferenceError('foo');
      };
      expect(foo).toThrowError(TypeError, 'boo');
    });

  });

});