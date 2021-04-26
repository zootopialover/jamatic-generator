+const _ObjectName_ = objectType({
    name: '_ObjectName_',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.field('createdAt', { type: 'DateTime' })
        t.nonNull.field('updatedAt', { type: 'DateTime' })
    }
})
