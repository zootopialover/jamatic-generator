t.nullable.field('get_ObjectName_', {
  type: '_ObjectName_',
  resolve: (_parent, args, context: Context) => {
    return context.prisma._ObjectNameLowerCased_.findUnique({
      where: { id: args.id || undefined },
    })
  },
})