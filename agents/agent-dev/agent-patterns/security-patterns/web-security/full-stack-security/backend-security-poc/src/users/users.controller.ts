import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    UseGuards, 
    ClassSerializerInterceptor, 
    UseInterceptors,
    NotFoundException,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
    Query
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { User } from './entities/user.entity';
  
  @Controller('users')
  @UseInterceptors(ClassSerializerInterceptor) // Automatically applies @Exclude() from entities
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    /**
     * Create a new user
     * Note: This endpoint is public as it's used for registration
     * In a real app, you might want to add rate limiting or other protections
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
      return this.usersService.create(createUserDto);
    }
  
    /**
     * Get user by ID
     * Protected by JWT auth guard
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
      try {
        return await this.usersService.findById(id);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    }
  
    /**
     * Get user by email
     * Protected by JWT auth guard
     * Used internally or for admin purposes
     */
    @UseGuards(JwtAuthGuard)
    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<User> {
      try {
        return await this.usersService.findByEmail(email);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new NotFoundException(`User with email ${email} not found`);
      }
    }
  
    /**
     * Get all users (with optional pagination)
     * Protected by JWT auth guard
     * In a real app, this would typically be admin-only
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ): Promise<{ users: User[], total: number, page: number, limit: number }> {
      // You would need to implement this method in your UsersService
      // This is just a placeholder showing the structure
      // return this.usersService.findAll(page, limit);
      
      // Since your current service doesn't have this method:
      throw new Error('Method not implemented. Add findAll method to UsersService');
    }
  
    /**
     * Check if email exists
     * Useful for registration form validation
     */
    @Get('check-email/:email')
    async checkEmailExists(@Param('email') email: string): Promise<{ exists: boolean }> {
      try {
        await this.usersService.findByEmail(email);
        return { exists: true };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return { exists: false };
        }
        throw error;
      }
    }
  }