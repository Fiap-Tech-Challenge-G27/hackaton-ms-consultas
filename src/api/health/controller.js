const getHealth = (req, res) => {
    res.status(200).json({ 'message': 'Server healthy' })
}

module.exports = {
    getHealth
}