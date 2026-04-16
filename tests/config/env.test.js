import config from '../../src/config/env.js';

describe('env config', () => {
  it('exports required fields when env is valid', () => {
    expect(config).toHaveProperty('DATABASE_URL');
    expect(config).toHaveProperty('JWT_SECRET');
    expect(config.PORT).toBe(3000);
  });
});
