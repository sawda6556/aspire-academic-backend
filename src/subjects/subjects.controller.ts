import { Controller, Get, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectCategory } from '../common/enums';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async findAll(@Query('category') category?: SubjectCategory) {
    if (category) {
      return this.subjectsService.findByCategory(category);
    }
    return this.subjectsService.findAll();
  }
}
