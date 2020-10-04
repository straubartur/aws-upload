const uuid = require('uuid');

/**
 * Add a prefix into filename
 * @param { string } value
 * @param { string } prefix
 * @return { string }
 */
function addPrefix (value, prefix = 'thumb-') {
    const matches = /^(.+?\/posts\/)(.+)$/.exec(value)
    return matches[1] + prefix + matches[2]
}

exports.seed = function (knex) {
    const feed_category = {
        id: uuid.v4(),
        name: 'Feeds'
    };

    const story_category = {
        id: uuid.v4(),
        name: 'Stories'
    };

    const package = {
        id: uuid.v4(),
        name: 'Novo Pacote'
    };

    const customer = {
        id: uuid.v4(),
        name: 'Mário, irmão do Abreu, primo do João',
        email: 'mario.santos@test.com',
        custom_name: 'Tiririca',
        custom_phone: '(11) 99887-6655',
        rank: 'consultora'
    };

    const purchase = {
        id: uuid.v4(),
        customer_id: customer.id,
        package_id: package.id,
        is_paid: 1,
        custom_name: customer.custom_name,
        custom_phone: customer.custom_phone,
        rank: customer.rank
    };

    return knex('Categories').insert([story_category, feed_category])
        .then(() => knex('Packages').insert(package))
        .then(() => {
            const feedPosts = [];
            const storyPosts = [];

            for (let i = 0; i < 20; i++) {
                feedPosts.push({
                    id: uuid.v4(),
                    package_id: package.id,
                    category_id: feed_category.id,
                    name: `Imagem ${i + 1}`,
                    aws_path: 'packages/06eef257-9317-4e17-a979-1316e4ed21c7/posts/0a44e5a7-2d3c-4bb7-ac0e-7c7c1161e83e.png',
                    coordinate_x: 10,
                    coordinate_y: 10,
                    content_type: 'image/png',
                    watermark_position: 1
                });

                storyPosts.push({
                    id: uuid.v4(),
                    package_id: package.id,
                    category_id: story_category.id,
                    name: `Imagem ${i + 1}`,
                    aws_path: 'packages/464f80a3-1f87-41ec-9a3c-c1f7b0be3f62/posts/2ed48356-6ec9-49b7-beba-12feec1b01b8.png',
                    coordinate_x: 10,
                    coordinate_y: 10,
                    content_type: 'image/png',
                    watermark_position: 1
                });
            }
            return knex('Package_posts').insert([...feedPosts, ...storyPosts]);
        })
        .then(() => knex('Customers').insert(customer))
        .then(() => knex('Purchases').insert(purchase))
        .then(() => knex('Package_posts').where({ package_id: purchase.package_id }))
        .then(packagePosts => {
            const purchasePosts = packagePosts.map(post => ({
                id: uuid.v4(),
                package_post_id: post.id,
                purchase_id: purchase.id,
                aws_path: post.aws_path,
                aws_path_thumb: addPrefix(post.aws_path),
                watermark_status: '',
                content_type: 'image/png'
            }));
            return knex('Purchase_posts').insert(purchasePosts);
        });
};
