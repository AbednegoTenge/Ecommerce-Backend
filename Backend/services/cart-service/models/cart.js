import dynamo from '../../../config/dynamodb.js';
import { PutCommand, GetCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb';

const CART_TABLE = "Cart";

const cart = {
    // create cart
    async save(userId, items) {
        const params = {
            TableName: CART_TABLE,
            Item: {
                id: userId,
                items,
                updatedAt: new Date().toISOString()
            }
        }
        await dynamo.send(new PutCommand(params));
        return params.Item;
    },

    // get a cart by user id
    async get(userId) {
        const params = {
            TableName: CART_TABLE,
            Key: { id: userId }
        };
        const result = await dynamo.send(new GetCommand(params));
        return result.Item;
    },

    // update a cart
    async update(userId, items) {
        const params = {
            TableName: CART_TABLE,
            Key: { id: userId },
            UpdateExpression: 'set items = :items, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':items': items,
                ':updatedAt': new Date().toISOString()
            },
            ReturnValues: 'ALL_NEW'
        };
        const result = await dynamo.send(new UpdateCommand(params));
        return result.Attributes;
    },

    // Delete a cart
    async delete(userId, productId) {
        const getParams = {
            TableName: CART_TABLE,
            Key: { id: userId }
        };
        const cartData = await dynamo.send(new GetCommand(getParams));
        const currentItems = cartData.Item?.items || [];

        const updatedItems = currentItems.filter(item => item.productId !== productId);

        return await this.update(userId, updatedItems);
    }
};

export default cart;