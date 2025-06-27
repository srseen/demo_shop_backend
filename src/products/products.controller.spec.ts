import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('should return the created product', async () => {
      const dto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description',
        price: 100,
        imageUrl: 'http://img.com/p.jpg',
      };

      const result = { id: 1, ...dto };

      mockService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [
        { id: 1, name: 'A', description: 'desc', price: 100, imageUrl: '' },
        { id: 2, name: 'B', description: 'desc', price: 200, imageUrl: '' },
      ];
      mockService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const result = {
        id: 1,
        name: 'A',
        description: 'desc',
        price: 100,
        imageUrl: '',
      };
      mockService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should return updated product', async () => {
      const dto: UpdateProductDto = {
        name: 'Updated',
        description: 'Updated',
        price: 999,
        imageUrl: 'http://img.com/u.jpg',
      };
      const result = { id: 1, ...dto };

      mockService.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);
      expect(mockService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should return deletion confirmation', async () => {
      const result = { deleted: true };
      mockService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });
});
