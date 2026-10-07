import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductPaginationDto } from './dto/pagination-product.dto';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Product) private productRepository: Repository<Product>) {}

  async create(createProductDto: CreateProductDto, userId: number, image: string) {
    const user = await this.userRepository.findOne({ where : { id: userId }, select: ["id", "email", "name"] });
    if(!user) throw new UnauthorizedException('User not found');
    const product = this.productRepository.create({...createProductDto, image, user});
    return this.productRepository.save(product);
  }

  async findAll(paginationdto: ProductPaginationDto) {
    return await this.productRepository.find({ skip: paginationdto.skip, take: paginationdto.limit ?? 10 });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id}, relations: ['user'], select: { user: { email: true, name: true }} });
    await this.productRepository.increment({ id }, 'views', 1)
    if(!product) throw new UnauthorizedException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number, file: Express.Multer.File) {
    const post = await this.productRepository.findOne({ where: {id}, relations: ['user'] });
    if(!post) throw new NotFoundException(`Post with id ${id} not found`);
    let image = post.image;
    if(file){
      if(post.image){
        const oldPath = join(process.cwd(), 'uploads', 'posts', post.image);
        if(fs.existsSync(oldPath)){
          fs.unlinkSync
      }
    }
    if(post.user?.id !== userId) throw new ForbiddenException(`You are not authorized to update this post`);
    const updatedPost = this.productRepository.merge(post, updateProductDto);
    return this.productRepository.save(updatedPost);
  }
}

  async remove(id: number, userId: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['user'] });
    if(!product) throw new UnauthorizedException('Product not found');
    if(product.user.id !== userId) throw new ForbiddenException('You are not allowed to delete this product');
    await this.productRepository.softDelete({ id });
    return { message: 'Product deleted successfully' };
  }
}
