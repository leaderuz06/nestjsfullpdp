import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UploadInterceptor } from 'src/upload/upload.interceptor';
import { ProductPaginationDto } from './dto/pagination-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(UploadInterceptor('product'))
  create(@Body() createProductDto: CreateProductDto, @Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.productService.create(createProductDto, req.user.id, file.filename);
  }

  @Get()
  findAll(@Query() paginationDto: ProductPaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.productService.update(+id, updateProductDto, req.user.id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.productService.remove(+id, req.user.id);
  }
}
