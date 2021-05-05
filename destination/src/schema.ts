import { intArg, makeSchema, nonNull, objectType, stringArg, inputObjectType, arg, asNexusMethod, enumType } from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import { Context } from "./context";

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
const SortOrder = enumType({ name: 'SortOrder', members: ['asc', 'desc'] });
const Query = objectType({
name: "Query",
definition(t) {
t.nonNull.field('draftsByUser', {
  type: 'Post',
  args: {
    userUniqueInput: nonNull(
      arg({
        type: 'UserUniqueInput',
      }),
    ),
  },
  resolve: (_parent, args, context: Context) => {
    return context.prisma.user
      .findUnique({
        where: {
          id: args.userUniqueInput.id || undefined,
          email: args.userUniqueInput.email || undefined,
        },
      })
      .posts({
        where: {
          published: false,
        },
      })
  },
})
t.nonNull.field('feed', {
  type: 'Post',
  args: {
    searchString: stringArg(),
    skip: intArg(),
    take: intArg(),
    orderBy: arg({
      type: 'PostOrderByUpdatedAtInput',
    }),
  },
  resolve: (_parent, args, context: Context) => {
    const or = args.searchString
      ? {
        OR: [
          { title: { contains: args.searchString } },
          { content: { contains: args.searchString } },
        ],
      }
      : {}

    return context.prisma.post.findMany({
      where: {
        published: true,
        ...or,
      },
      take: args.take || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    })
  },
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
  type: 'Post',
  args: {
    data: nonNull(
      arg({
        type: 'PostCreateInput',
      }),
    ),
    authorEmail: nonNull(stringArg()),
  },
  resolve: (_, args, context: Context) => {
    return context.prisma.post.create({
      data: {
        title: args.data.title,
        content: args.data.content,
        author: {
          connect: { email: args.authorEmail },
        },
      },
    })
  },
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
  type: 'Post',
  args: {
    id: nonNull(intArg()),
  },
  resolve: (_, args, context: Context) => {
    return context.prisma.post.update({
      where: { id: args.id || undefined },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  },
})
t.nonNull.field('signupUser', {
  type: 'User',
  args: {
    data: nonNull(
      arg({
        type: 'UserCreateInput',
      }),
    ),
  },
  resolve: (_, args, context: Context) => {
    const postData = args.data.posts?.map((post) => {
      return { title: post.title, content: post.content || undefined }
    })
    return context.prisma.user.create({
      data: {
        name: args.data.name,
        email: args.data.email,
        posts: {
          create: postData,
        },
      },
    })
  },
})
t.nonNull.field('togglePublishPost', {
  type: 'Post',
  args: {
    id: nonNull(intArg()),
  },
  resolve: async (_, args, context: Context) => {
    try {
      const post = await context.prisma.post.findUnique({
        where: { id: args.id || undefined },
        select: {
          published: true,
        },
      })
      return context.prisma.post.update({
        where: { id: args.id || undefined },
        data: { published: !post?.published },
      })
    } catch (e) {
      throw new Error(
        `Post with ID ${args.id} does not exist in the database.`,
      )
    }
  },
})
}
})
export const schema = makeSchema({
    types: [
    DateTime,
    SortOrder,
    Query,
    Mutation,
    ],
    outputs: {schema: __dirname + '/../schema.graphql',typegen: __dirname + '/generated/nexus.ts'},
    contextType: {module: require.resolve('./context'),export: 'Context'},
    sourceTypes: {modules: [{module: '@prisma/client',alias: 'prisma'}]},
    })
;
