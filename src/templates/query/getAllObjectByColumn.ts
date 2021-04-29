t.nonNull.list.nonNull.field('getAll_ObjectName_By_ColumnName_', {
    type: '_ObjectName_',
    resolve: (_parent, args, context: Context) => {
        return context.prisma._ObjectNameLowerCased_.findMany({
            where: { _ColumnNameLowerCased_: args._ColumnNameLowerCased_ || undefined },
        })
    },
})