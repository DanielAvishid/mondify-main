import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

async function query(filterBy) {
    try {
        const criteria = {
            title: { $regax: filterBy.title, $options: 'i' }
        }
        const collection = await dbService.getCollection('board')
        let boards = await collection.find(criteria)
        console.log('HERE', boards)
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ _id: ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ _id: ObjectId(boardId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = {
            title: board.title,
            description: board.description,
            isStarred: board.isStarred,
            archivedAt: board.archivedAt,
            createdBy: board.createdBy,
            style: board.style,
            statusLabels: board.statusLabels,
            priorityLabels: board.priorityLabels,
            groups: board.groups,
            activities: board.activities,
            members: board.members,
            cmpsOrder: board.cmpsOrder
        }
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ _id: ObjectId(board._id) }, { $set: boardToSave })
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

export const boardService = {
    remove,
    query,
    getById,
    add,
    update
}
