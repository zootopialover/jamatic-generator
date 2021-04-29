import { intArg, makeSchema, nonNull, objectType, stringArg, inputObjectType, arg, asNexusMethod, enumType } from "nexus";
import DateTimeResolver from "graphql-scalars";
import Context from "./context";

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
const SortOrder = enumType({ name: 'SortOrder', members: ['asc', 'desc'] });
const Query = objectType({
name: "Query",
definition(t) {
t.nonNull.field('draftsByUser', {
  model: 'Post',
  inputs: {
    userUniqueInput: {
      attributes: {
        id: 'integer',
        email: 'string'
      },
      required: true
    }
  },
  resolve: (context, args) => {
    return context.prisma['User'].find({
      where: {
        id: args.userUniqueInput.id || undefined,
        email: args.userUniqueInput.email || undefined,
      }
    }).posts({
      where: {
        published: false,
      },
    });
  }
})
t.nonNull.field('feed', {
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

    return context.prisma['Post'].findMany({
      where: {
        published: true,
        ...or,
      },
      take: args.take || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    })
  }
})
t.nonNull.list.nonNull.field('getAllPost', {
    type: 'Post',
    resolve: (_parent, args, context: Context) => {
        return context.prisma.post.findMany()
    },
})
t.nonNull.list.nonNull.field('getAllPostByUser', {
    type: 'Post',
    resolve: (_parent, args, context: Context) => {
        return context.prisma.post.findMany({
            where: { user: args.user || undefined },
        })
    },
})
t.nonNull.list.nonNull.field('getAllUser', {
    type: 'User',
    resolve: (_parent, args, context: Context) => {
        return context.prisma.user.findMany()
    },
})
t.nonNull.list.nonNull.field('getAllUserByName', {
    type: 'User',
    resolve: (_parent, args, context: Context) => {
        return context.prisma.user.findMany({
            where: { name: args.name || undefined },
        })
    },
})
t.nullable.field('getPost', {
  type: 'Post',
  resolve: (_parent, args, context: Context) => {
    return context.prisma.post.findUnique({
      where: { id: args.id || undefined },
    })
  },
})
t.nullable.field('getPostByTitle', {
    type: 'Post',
    resolve: (_parent, args, context: Context) => {
      return context.prisma.post.findFirst({
        where: { title: args.title || undefined },
      })
    },
  })
}
})
const Mutation = objectType({
name: "Mutation",
definition(t) {
t.nonNull.field('createDraft', {
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
    return context.prisma['Post'].create({
      title: args.data.title,
      content: args.data.content,
      author: {
        connect: { email: args.authorEmail },
      }
    })
  }
})
t.field('deletePost', {
  type: 'Post',
  args: {
    id: nonNull(intArg()),
  },
  resolve: (_, args, context: Context) => {
    return context.prisma.post.delete({
      where: { id: args.id },
    })
  },
})
t.nonNull.field('incrementPostViewCount', {
  model: 'Post',
  resolve: (context, args) => {
    return context.prisma['Post'].update({
      where: { id: args.id || undefined },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }
})
t.nonNull.field('signupUser', {
  model: 'User',
  inputs: {
    data: {
      email: {
        type: 'string',
        required: true
      },
      name: 'string',
      posts: {
        title: {
          type: 'string',
          required: true
        },
        content: 'string'
      }
    }
  },
  resolve: (context, args) => {
    const postData = args.data.posts
      ? args.data.posts.map((post) => {
          return { title: post.title, content: post.content || undefined }
        })
      : []
    return context.prisma['User'].create({
      name: args.data.name,
      email: args.data.email,
      posts: {
        create: postData,
      }
    });
  }
})
t.nonNull.field('togglePublishPost', {
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
    const post = await context.prisma['Post'].findUnique({
      where: { id: args.id || undefined },
      select: ['published']
    })

    if (!post) {
      throw new Error(
        `Post with ID ${args.id} does not exist in the database.`,
      )
    }

    return context.prisma['Post'].update({
      where: { id: args.id || undefined },
      data: { published: !post.published },
    })
  }
})
}
})














