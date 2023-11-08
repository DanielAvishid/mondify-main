import { boardService } from './board.service.js'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

export async function getBoards(req, res) {
    try {
        const { title } = req.query
        const filterBy = { title }
        const boards = await boardService.query(filterBy)
        res.json(boards)
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

export async function getBoardById(req, res) {
    try {
        const boardId = req.params.id
        const board = await boardService.getById(boardId)
        res.json(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        res.status(500).send({ err: 'Failed to get board' })
    }
}

export async function addBoard(req, res) {
    try {
        const board = req.body
        const addedBoard = await boardService.add(board)
        res.json(addedBoard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}

export async function updateBoard(req, res) {
    try {
        const { loggedinUser } = asyncLocalStorage.getStore()
        const board = req.body
        const updatedBoard = await boardService.update(board)
        socketService.broadcast({ type: 'change-board', data: updatedBoard, room: updateBoard._id, userId: loggedinUser._id })
        res.json(updatedBoard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}

export async function removeBoard(req, res) {
    try {
        const boardId = req.params.id
        await boardService.remove(boardId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove board', err)
        res.status(500).send({ err: 'Failed to remove board' })
    }
}