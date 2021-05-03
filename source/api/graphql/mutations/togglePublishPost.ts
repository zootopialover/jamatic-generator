export default {
  type: 'Post',
  args: {
    id: nonNull(intArg()),
  },
  resolve: async (_, args, context: Context) => {
    try {
      const post = await jamatic.schema.post.findUnique({
        where: { id: args.id || undefined },
        select: {
          published: true,
        },
      })
      return jamatic.schema.post.update({
        where: { id: args.id || undefined },
        data: { published: !post?.published },
      })
    } catch (e) {
      throw new Error(
        `Post with ID ${args.id} does not exist in the database.`,
      )
    }
  },
}


/* export default {
  model: 'Post',
  inputs: {
    data: {
      title: {
        type: 'string',
        required: true
      },
      content: 'string',
      authorEmail: {
        type: 'string',
        required: true
      }
    }
  },
  resolve: (context, args) => {
    const post = await jamatic.schema['Post'].findUnique({
      where: { id: args.id || undefined },
      select: ['published']
    })

    if (!post) {
      throw new Error(
        `Post with ID ${args.id} does not exist in the database.`,
      )
    }

    return jamatic.schema['Post'].update({
      where: { id: args.id || undefined },
      data: { published: !post.published },
    })
  }
} */