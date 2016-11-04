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

    it('should sort object props', function () {
      var a = {
        bar: 42,
        qux: 'fox',
        foo: {
          c: 2,
          a: 0,
          b: 1,
        }
      };
      var b = {
        far: 50,
        qux: 'fox',
        extra: 'extra',
        bar: 42,
        foo: {
          b: 1,
          c: 2,
          a: 0,
        }
      };
      expect(a).toEqual(b);
    });

  });

});