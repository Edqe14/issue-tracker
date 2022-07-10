import Inhibit from './inhibit';
import Config from '@/config';
import { GuildMember, PermissionResolvable } from 'discord.js';

type ResType = (
  // eslint-disable-next-line no-unused-vars
  target: unknown,
  // eslint-disable-next-line no-unused-vars
  key: string|symbol,
  // eslint-disable-next-line no-unused-vars
  descriptor: PropertyDescriptor
) => PropertyDescriptor;

export const OwnerOnly = (): ResType => Inhibit((cmd) => Config.owners.includes(cmd.user.id));

export const HasPermission = (permissions: PermissionResolvable): ResType => Inhibit(
  (cmd) => (cmd.member as GuildMember)?.permissions.has(permissions)
);
