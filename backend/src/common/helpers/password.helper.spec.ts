import { hashPassword, verifyPassword } from './password.helper';

describe('password helper', () => {
  it('hashes passwords with a random salt and verifies them', async () => {
    const firstHash = await hashPassword('correct horse battery staple');
    const secondHash = await hashPassword('correct horse battery staple');

    expect(firstHash).not.toBe('correct horse battery staple');
    expect(firstHash).not.toBe(secondHash);
    await expect(
      verifyPassword('correct horse battery staple', firstHash),
    ).resolves.toBe(true);
    await expect(verifyPassword('wrong password', firstHash)).resolves.toBe(
      false,
    );
  });

  it('rejects malformed and legacy plaintext values', async () => {
    await expect(verifyPassword('password', 'password')).resolves.toBe(false);
    await expect(verifyPassword('password', 'scrypt:bad:00')).resolves.toBe(
      false,
    );
  });
});
