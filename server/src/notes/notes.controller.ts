import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './notes.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() data: Partial<Note>) {
    return this.notesService.create(data);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }
}
