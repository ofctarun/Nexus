import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique invite code in the format: NXS-XXXX-XXXX
 */
export const generateInviteCode = () => {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  return `NXS-${uuid.slice(0, 4)}-${uuid.slice(4, 8)}`;
};
