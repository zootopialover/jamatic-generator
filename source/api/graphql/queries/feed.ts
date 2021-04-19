export default {
  model: 'Post',
  inputs: {
    searchString: 'string',
    skip: 'integer',
    take: 'integer',
    orderBy: {
      'updatedAt': {
        type: 'enum',
        members: [
          'asc',
          'desc'
        ]
      }
    }
  },
  resolve: (context, args) => {
    const or = args.searchString
      ? {
          OR: [
            { title: { contains: args.searchString } },
            { content: { contains: args.searchString } },
          ],
        }
      : {}

    return jamatic.schema['Post'].findMany({
      where: {
        published: true,
        ...or,
      },
      take: args.take || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    })
  }
}