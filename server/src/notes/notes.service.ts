import { Injectable } from '@nestjs/common';
import { Note } from './notes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  create(noteData: Partial<Note>) {
    const note = this.noteRepository.create(noteData);
    return this.noteRepository.save(note);
  }

  findAll() {
    return this.noteRepository.find();
  }
}
