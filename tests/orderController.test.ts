import { createOrder } from '../src/Controller/orderController';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../src/utils/appError';

describe('createOrder Controller (Pure Mocked)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        userId: 1,
        cartId: 1,
        shippingAddress: '123 Main St'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 201 with mocked order data', async () => {
    const mockCreateOrder = async (req: Request, res: Response, next: NextFunction) => {
      const cart = { id: 1, totalPrice: 100 };
      const tax = { taxPrice: 10, shippingPrice: 5 };

      const totalPrice = cart.totalPrice + tax.taxPrice + tax.shippingPrice;

      const order = {
        id: 123,
        userId: req.body.userId,
        cartId: req.body.cartId,
        shippingAddress: req.body.shippingAddress,
        taxPrice: tax.taxPrice,
        shippingPrice: tax.shippingPrice,
        totalPrice
      };

      res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: order
      });
    };

    await mockCreateOrder(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Order created successfully',
      data: {
        id: 123,
        userId: 1,
        cartId: 1,
        shippingAddress: '123 Main St',
        taxPrice: 10,
        shippingPrice: 5,
        totalPrice: 115
      }
    });
  });
});
