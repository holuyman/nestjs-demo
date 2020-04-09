import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Photo } from './photo.entity'

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private readonly photoRepositoty: Repository<Photo>,
    ) { }
    findAll(): Promise<Photo[]> {
        return this.photoRepositoty.find();
    }
    async findPhoto(id: number): Promise<Photo> {
        return await this.photoRepositoty.findOne({ id });
    }
    async addPhoto(): Promise<string> {
        const photo = new Photo();
        photo.name = '123';
        photo.description = '照片';
        photo.filename = '第一';
        photo.views = 1;
        photo.isPublished = false;
        return this.photoRepositoty.save(photo)
            .then(res => {
                return 'add photo...'
            }).catch(err => {
                return err
            })
    }
}
