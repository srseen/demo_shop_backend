import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ObjectLiteral } from 'typeorm';

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const mockProductRepo = (): MockRepo<Product> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: MockRepo<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get(getRepositoryToken(Product));
  });

  describe('create', () => {
    it('should create and save a product', async () => {
      const dto: CreateProductDto = {
        name: 'Product A',
        description: 'Description A',
        price: 100,
        imageUrl: 'http://example.com/image.jpg',
      };
      const createdProduct = { id: 1, ...dto };

      repo.create?.mockReturnValue(createdProduct);
      repo.save?.mockResolvedValue(createdProduct);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(createdProduct);
      expect(result).toEqual(createdProduct);
    });

    it('should create product without imageUrl', async () => {
      const dto: CreateProductDto = {
        name: 'No Image',
        description: 'Test',
        price: 99,
      };
      const createdProduct = { id: 2, ...dto };

      repo.create?.mockReturnValue(createdProduct);
      repo.save?.mockResolvedValue(createdProduct);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(createdProduct);
      expect(result.imageUrl).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [
        { id: 1, name: 'A', description: 'Desc A', price: 100 },
        { id: 2, name: 'B', description: 'Desc B', price: 200 },
      ];
      repo.find?.mockResolvedValue(products);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const product = { id: 1, name: 'A', description: 'Desc A', price: 100 };
      repo.findOneBy?.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(product);
    });

    it('should return null if product not found', async () => {
      repo.findOneBy?.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a product and return the updated result', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated A',
        description: 'Updated Desc',
        price: 150,
        imageUrl: 'http://updated.com/image.jpg',
      };
      const updatedProduct = { id: 1, ...updateDto };

      repo.update?.mockResolvedValue({ affected: 1 });
      repo.findOneBy?.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateDto);

      expect(repo.update).toHaveBeenCalledWith(1, updateDto);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(updatedProduct);
    });

    it('should return null if product not found after update', async () => {
      repo.update?.mockResolvedValue({ affected: 0 });
      repo.findOneBy?.mockResolvedValue(null);

      const result = await service.update(999, {
        name: 'X',
        description: 'X',
        price: 0,
        imageUrl: '',
      });

      expect(repo.update).toHaveBeenCalledWith(999, expect.any(Object));
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete the product and return confirmation', async () => {
      repo.delete?.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should still return deleted: true even if nothing was deleted', async () => {
      repo.delete?.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(repo.delete).toHaveBeenCalledWith(999);
      expect(result).toEqual({ deleted: true });
    });
  });
});
