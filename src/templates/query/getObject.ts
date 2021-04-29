t.nullable.field('find_ObjectName_', {
  type: '_ObjectName_',
  args: {
    id: intArg(),
  },
  resolve: (_parent, args, context: Context) => {
    return context.prisma._ObjectName_.findUnique({
      where: { id: args.id || undefined },
    })
  },
})