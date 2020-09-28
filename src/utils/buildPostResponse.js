const s3 = require('../externals/s3');

exports.buildPostResponse = function buildPostResponse(post) {
    if (post.aws_path) {
        post.aws_path = s3.buildS3Url(post.aws_path);
    }

    if (post.aws_path_thumb) {
        post.aws_path_thumb = s3.buildS3Url(post.aws_path_thumb);
    }

    return post;
}
