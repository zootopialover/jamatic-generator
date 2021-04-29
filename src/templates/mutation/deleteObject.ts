t.field('delete_ObjectName_', {
  type: '_ObjectName_',
  args: {
    id: nonNull(intArg()),
  },
  resolve: (_, args, context: Context) => {
    return context.prisma._ObjectNameLowerCased_.delete({
      where: { id: args.id },
    })
  },
})