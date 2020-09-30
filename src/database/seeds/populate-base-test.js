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
                    aws_path: 'packages/d1727db1-fa0c-40ec-b9e9-c3814740a230/posts/92dd9938-8e78-48ae-a4b3-d97d305e3947',
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
                    aws_path: 'packages/d1727db1-fa0c-40ec-b9e9-c3814740a230/posts/92dd9938-8e78-48ae-a4b3-d97d305e3947',
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
