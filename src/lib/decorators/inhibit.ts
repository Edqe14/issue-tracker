import SlashCommand from '../structures/SlashCommandPiece';

export const Inhibit = (runner: SlashCommand['run']) => function decorate(
  target: unknown,
  key: string | symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  // eslint-disable-next-line no-param-reassign, func-names, @typescript-eslint/no-explicit-any
  descriptor.value = async function (ctx: any): Promise<any> {
    const result = await runner(ctx);
    if (result === false && result !== undefined && result !== null) return null;

    return original.apply(this, [ctx]);
  };

  return descriptor;
};

export default Inhibit;
