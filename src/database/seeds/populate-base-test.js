const uuid = require('uuid');

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
        is_paid: true,
        custom_name: customer.custom_name,
        custom_phone: customer.custom_phone,
        rank: customer.rank
    };

    return knex('Categories').insert([story_category, feed_category])
        .then(() => knex('Packages').insert(package))
        .then(() => {
            const feedPosts = [];
            const storyPosts = [];
                feedPosts.push({
                    id: 'd5471c65-9683-492a-98fa-954c4081917d',
                    package_id: package.id,
                    category_id: feed_category.id,
                    name: `Feed 1`,
                    aws_path: 'packages/58063780-ce39-4d0e-9640-1ad35f3ed40e/posts/d5471c65-9683-492a-98fa-954c4081917d.png',
                    coordinate_x: 15,
                    coordinate_y: 15
                });
                storyPosts.push({
                    id: '21366721-5c4c-42fc-80e7-2991f3ff54b8',
                    package_id: package.id,
                    category_id: story_category.id,
                    name: `Story 1`,
                    aws_path: 'packages/58063780-ce39-4d0e-9640-1ad35f3ed40e/posts/21366721-5c4c-42fc-80e7-2991f3ff54b8.png',
                    coordinate_x: 15,
                    coordinate_y: 15
                });
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
                aws_path: post.aws_path
            }));
            return knex('Purchase_posts').insert(purchasePosts);
        });
};
