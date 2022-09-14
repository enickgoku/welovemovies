const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params
    const review = await service.read(reviewId)
    if (review) {
        res.locals.review = review
        return next()
    }
    return next({ status: 404, message: "Review cannot be found" })
}


async function update(req, res) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    let reviewData = await service
        .update(updatedReview)

    let critic = await service.readReviewCritic(res.locals.review.critic_id)
    const data = {
        ...reviewData,
        critic,
    }
    res.json({ data });
    
}

async function destroy(req, res) {
    await service
        .destroy(res.locals.review.review_id)
    res.sendStatus(204)
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}