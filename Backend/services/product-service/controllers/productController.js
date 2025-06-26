import Product from '../models/product.js';


const productController = {
    async create(req, res) {
        try {
            const { name, description, price, category, stock, imageUrl } = req.body;

            const newProduct = await Product.create({
                name,
                description,
                price,
                category,
                stock,
                imageUrl
            });

            return res.status(201).json({ message: 'Product added successfully', product: newProduct});

        } catch (err) {
            console.error('Error adding Product:', err.message);
            if (err.name == 'ValidationError') {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        }
    }
};

export default productController;