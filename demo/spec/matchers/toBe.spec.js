describe('Matcher', function () {

  describe('toBe', function () {

    it('should diff booleans', function () {
      expect(true).toBe(false);
    });

    it('should diff strings', function () {
      expect('foo').toBe('bar');
    });

    it('should diff strings', function () {
      expect('yo banana apple').toBe('yo gavana apple');
    });

    it('should diff arrays', function () {
      var a = [1, 2, 3];
      var b = [1, 2, 4];
      expect(a).toBe(b);
    });

    it('should NOT diff', function () {
      expect(true).not.toBe(true);
    });

  });

  describe('toBeDefined', function () {

    it('should NOT diff', function () {
      expect(undefined).toBeDefined();
    });

  });

  describe('toBeTruthy', function () {

    it('should NOT diff', function () {
      expect(false).toBeTruthy();
    });

  });

  describe('toBeUndefined', function () {

    it('should diff', function () {
      expect('defined').toBeUndefined();
    });

  });

  describe('toBeCloseTo', function () {

    it('should NOT diff', function () {
      expect(3).toBeCloseTo(5);
    });

  });

});