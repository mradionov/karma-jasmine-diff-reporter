describe('Matcher', function () {

  describe('toHaveBeenCalledWith', function () {

    it('should diff objects', function () {
      var spy = jasmine.createSpy('spy');
      var a = { foo: 'bar' },
          b = { baz: 'qux' };

      spy(a);

      expect(spy).toHaveBeenCalledWith(b);
    });

    it('should diff booleans', function () {
      var spy = jasmine.createSpy('spy');

      spy(true);

      expect(spy).toHaveBeenCalledWith(false);
    });

  });

});