describe('Matcher', function () {

  describe('toEqual', function () {

    it('should diff objects', function () {
      var a = { foo: 'bar' },
          b = { baz: 'qux' };
      expect(a).toEqual(b);
    });

    it('should diff strings', function () {
      expect('foo').toBe('bar');
    });

    it('should NOT diff ', function () {
      var a = { foo: 'bar' };
      expect(a).not.toEqual(a);
    });

  });

});