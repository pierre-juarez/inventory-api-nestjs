import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable() // marca esta clase como "inyectable" para que Nest la pueda pasar al controlador
export class ProductsService {
  constructor(
    // @InjectRepository nos da acceso a los métodos típicos de TypeORM (find, save, remove...)
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // CREATE
  async create(dto: CreateProductDto): Promise<Product> {
    // Antes de crear el producto, verificamos que la categoría exista
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new BadRequestException(
        `Categoría '${dto.categoryId}' no existe, intenta agregar un producto con una categoría válida`,
      );
    }
    // .create() arma el objeto en memoria (todavía no toca la BD)
    const product = this.productRepo.create({ ...dto, createdAt: new Date() });
    // .save() sí ejecuta el INSERT en MySQL
    return await this.productRepo.save(product);
  }

  // READ (todos)
  async getProductosAll(): Promise<Product[]> {
    // relations: ['category'] hace un JOIN automático para traer también la categoría de cada producto
    // Equivale a: SELECT * FROM TB_PRODUCTOS p LEFT JOIN TB_CATEGORIA c ON c.IDCAT = p.IDCAT;
    return await this.productRepo.find({ relations: { category: true } });
  }
  // READ (uno solo)
  async getOneProducto(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { category: true }, // trae también la categoría asociada
      // Equivale a: SELECT * FROM TB_PRODUCTOS p LEFT JOIN TB_CATEGORIA c
      // ON c.IDCAT = p.IDCAT WHERE p.IDPROD = ?;
    });
    if (!product) {
      // Si no existe, cortamos la ejecución con un error 404 (ver sección 9)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }
  // UPDATE
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.getOneProducto(id); // reusamos getOneProducto, ya valida que exista
    Object.assign(product, dto); // pisa o chanca solo los campos que vinieron en el DTO
    return await this.productRepo.save(product);
    // Equivale a: UPDATE TB_PRODUCTOS SET ... WHERE IDPROD = ?;
  }
  // DELETE
  async eliminarProducto(id: number): Promise<void> {
    const product = await this.getOneProducto(id);
    await this.productRepo.remove(product);
    // Equivale a: DELETE FROM TB_PRODUCTOS WHERE IDPROD = ?;
  }
  // Se usa luego de subir un archivo (sección 8), para guardar la URL en el producto
  async saveImage(id: number, imageUrl: string): Promise<Product> {
    const product = await this.getOneProducto(id);
    product.image = imageUrl;
    return await this.productRepo.save(product);
  }

  async findInStockWithCategory() {
    return await this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.category', 'cat') // innerJoin: solo trae productos que SÍ tengan categoría válida
      .select(['p.id', 'p.name', 'p.price', 'cat.name'])
      .where('p.stock > 0')
      .getMany();
    // SQL equivalente:
    // SELECT p.IDPROD, p.NOMBRE, p.PRECIO, c.NOMBRE
    // FROM TB_PRODUCTOS p
    // INNER JOIN TB_CATEGORIA c ON c.IDCAT = p.IDCAT
    // WHERE p.STOCK > 0;
  }

  async getProductsRaw() {
    return await this.productRepo
      .createQueryBuilder('p')
      .innerJoin('TB_CATEGORIA', 'c', 'c.IDCAT = p.IDCAT') // tabla + alias + condición ON, todo a mano
      .select(['p.IDPROD AS id', 'p.NOMBRE AS name', 'c.NOMBRE AS category'])
      .where('p.STOCK > 0')
      .orderBy('p.NOMBRE', 'ASC')
      .getRawMany();
  }
  // SQL equivalente:
  // SELECT p.IDPROD AS id, p.NOMBRE AS name, c.NOMBRE AS category
  // FROM TB_PRODUCTOS p
  // INNER JOIN TB_CATEGORIA c ON c.IDCAT = p.IDCAT
  // WHERE p.STOCK > 0
  // ORDER BY p.NOMBRE ASC;

  /** async getHistorial() {
    const rows = await this.historialRepo
      .createQueryBuilder('h')
      .innerJoin('TB_PRODUCTOS', 'p', 'p.IDPROD = h.IDPROD')
      .leftJoin('TB_USUARIO', 'pu', 'pu.IDUSER = p.IDUSER')
      .select([
        'h.IDPROD    AS idProd',
        'p.CODPROD   AS code',
        'p.DESPROD   AS description',
        'p.FECHAMOD  AS lastModified',
        'pu.NOMBUSER AS updatedBy',
        'h.IDUSER    AS idUser',
        'h.NOMBUSER  AS nombre',
        'h.EST_REVDO AS reviewed',
        'h.FECHAMOD  AS fechaMod',
      ])
      .where('p.EST_LISTO = 0')
      .orderBy('h.IDPROD', 'ASC')
      .addOrderBy('h.IDUSER', 'ASC')
      .getRawMany();

    const map = new Map<
      string,
      {
        idProd: string;
        code: string;
        description: string;
        lastModified: Date | null;
        updatedBy: string;
        reviewers: object[];
      }
    >();
    for (const row of rows) {
      if (!map.has(row.idProd)) {
        map.set(row.idProd, {
          idProd: row.idProd,
          code: row.code,
          description: row.description,
          lastModified: row.lastModified,
          updatedBy: row.updatedBy,
          reviewers: [],
        });
      }
      map.get(row.idProd)!.reviewers.push({
        idUser: row.idUser,
        nombre: row.nombre,
        reviewed: Boolean(Number(row.reviewed)),
        fechaMod: row.fechaMod,
      });
    }

    const data = Array.from(map.values());
    return { total: data.length, data };
  } **/
}
