import Product from '../models/product.js';
import { uploadFileToS3 } from '../../../config/awsS3.js';


const productController = {
    async create(req, res) {
        try {
            const { name, description, price, category, stock} = req.body;
            let image = null;

            if (req.file) {
                image = await uploadFileToS3(req.file);
            }

            const newProduct = await Product.create({
                name,
                description,
                price,
                category,
                stock,
                image
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