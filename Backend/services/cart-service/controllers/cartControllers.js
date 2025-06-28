import cart from '../models/cart.js';



const cartController = {
    async saveToCart(req, res) {
        const { items } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Cart items are required' });
        }
        try {
            const savedCart = await cart.save({ userId, items });
            return res.status(201).json({ message: 'Cart saved successfully', cart: savedCart});

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getCartItems(req, res) {
        const userId = req.user.id;

        try {
            const cartItems = await cart.get(userId);
            return res.status(200).json({ message: 'Cart items retrieved successfully', cart: cartItems || {items: []}});

        } catch (err) {
            console.error('Error getting cart items:', err.message);
            return res.status(500).json({ message: 'Internal server error'});
        }
    },

    async updateCart(req, res) {
        const { items } = req.body;
        const userId = req.user.id;

        try {
            const updatedCart = await cart.update({ userId, items });
            return res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });

        } catch (err) {
            console.error('Error updating cart:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async removeFromCart(req, res) {
        const { productId } = req.params.id;
        const userId = req.user.id;

        try {
            const updatedCart = await cart.delete({userId, productId});
            return res.status(200).json({ message: 'Product removed from cart successfully', cart: updatedCart });

        } catch (err) {
            console.error('Error deleting product from cart:', err.message);
        }
    }
};

export default cartController;