const knex = require("../db/connection");

function read(review_id) {
    return knex("reviews")
        .select("*")
        .where({review_id})
        .first()
}

function readReviewCritic(critic_id) {
    return knex("critics")
      .select("*")
      .where({ critic_id })
      .first()
}

function update(updatedReview) {
    return knex("reviews as r")
        .update(updatedReview, "*")
        .where({"r.review_id": updatedReview.review_id})
        .then(() => read(updatedReview.review_id))
}

function destroy(review_id) {
    return knex("reviews")
        .where({review_id})
        .del()
}

module.exports = {
    read,
    update,
    destroy,
    readReviewCritic,
}