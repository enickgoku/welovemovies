const path = require("path")
const service = require("./movies.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


async function movieExists(req, res, next) {
    const { movieId } = req.params
    const movie = await service.read(movieId)
    if (movie) {
        res.locals.movie = movie
        return next()
    }
    return next({ status: 404, message: "Movie cannot be found" })
}

async function list(req, res) {
    const isShowing = req.query.is_showing
    if (isShowing == 'true') {
        res.json({ data: await service.listShowing() })
    }
    res.json({ data: await service.list() })
}

async function read(req, res) {
    res.json({ data: res.locals.movie })
}

async function theaters(req, res) {
    res.json({ data: await service.theaters(req.params.movieId)})
}

async function reviews(req, res) {
    res.json({ data: await service.reviews(req.params.movieId) })
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), read],
    theaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theaters)],
    reviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(reviews)],
}