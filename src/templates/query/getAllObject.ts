t.nonNull.list.nonNull.field('all_ObjectName_s', {
    type: '_ObjectName_',
    resolve: (_parent, _args, context: Context) => {
        return context.prisma._ObjectName_.findMany()
    },
})