t.nullable.field('get_ObjectName_By_ColumnName_', {
    type: '_ObjectName_',
    resolve: (_parent, args, context: Context) => {
      return context.prisma._ObjectNameLowerCased_.findFirst({
        where: { _ColumnNameLowerCased_: args._ColumnNameLowerCased_ || undefined },
      })
    },
  })