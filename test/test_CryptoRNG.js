const { assert } = require('chai')
, { CryptRNG } = require('../lib/CryptoRNG');


describe('CryptoRNG', () => {
  it('should generate probabilites between 0 and 1', done => {
    let minObserverd = 1, maxObserved = 0;

    for (let i = 0; i < 25000; i++) {
      const rand = CryptRNG.nextProbability;
      assert.isAtLeast(rand, 0);
      assert.isAtMost(rand, 1);

      if (rand < minObserverd) {
        minObserverd = rand;
      }
      if (rand > maxObserved) {
        maxObserved = rand;
      }
    }

    // Of course, statistically speaking, sometimes this test will fail.
    assert.isAtLeast(maxObserved, 0.975);
    assert.isAtMost(minObserverd, 0.025);

    done();
  });


  it('should generate signed 32-bit integers', done => {
    let minObserverd = 1, maxObserved = -1;

    for (let i = 0; i < 25000; i++) {
      const rand = CryptRNG.nextInt32;
      assert.isAtLeast(rand, -1 * 2**31);
      assert.isAtMost(rand, 2**31);

      if (rand < minObserverd) {
        minObserverd = rand;
      }
      if (rand > maxObserved) {
        maxObserved = rand;
      }
    }

    // Of course, statistically speaking, sometimes this test will fail.
    assert.isAtLeast(maxObserved, 2**30);
    assert.isAtMost(minObserverd, -1 * 2**30);

    done();
  });
});