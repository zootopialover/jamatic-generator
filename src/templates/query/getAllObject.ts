t.nonNull.list.nonNull.field('getAll_ObjectName_', {
    type: '_ObjectName_',
    resolve: (_parent, args, context: Context) => {
        return context.prisma._ObjectNameLowerCased_.findMany()
    },
})