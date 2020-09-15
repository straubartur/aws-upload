
exports.buildPaginate = async function buildPaginate(pageNumber, model, limitNumber) {
    const modelCount = await model().count()
    const itensFound = modelCount && modelCount[0] && modelCount[0]['count(*)'];

    return {
        page: pageNumber,
        itensFound: itensFound,
        totalPages: Math.ceil(itensFound / limitNumber) || 1
    };
}