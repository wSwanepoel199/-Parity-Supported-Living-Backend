

export const genAvatar = async (userid) => {
  const { identicon } = await import('@dicebear/collection');
  const { createAvatar } = await import('@dicebear/core');
  const avatar = await createAvatar(identicon, {
    seed: userid
  }).toDataUri();
  return avatar;
};
