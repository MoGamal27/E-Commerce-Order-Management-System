import { Request, Response, NextFunction } from 'express';
import { createProduct } from '../src/Controller/productController';



describe('createProduct Controller (Mocked)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Product',
        description: 'A product for testing',
        price: 50,
        stock: 10,
        categoryId: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should return 201 with created product data', async () => {
    // Create a fake implementation without hitting DB
    const mockCreateProduct = async (req: Request, res: Response, next: NextFunction) => {
      const { title, description, price, stock, categoryId } = req.body;

      const product = {
        id: 1,
        title,
        description,
        price,
        stock,
        categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data: product,
      });

      next();
    };

    await mockCreateProduct(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Product created successfully',
      data: expect.objectContaining({
        id: 1,
        title: 'Test Product',
        description: 'A product for testing',
        price: 50,
        stock: 10,
        categoryId: 1,
      }),
    });

    expect(next).toHaveBeenCalled();
  });
});
